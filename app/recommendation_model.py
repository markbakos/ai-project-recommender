import random
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from typing import List
import pickle
from project_scraper import Project, ProjectScraper
import torch
import torch.nn as nn
import torch.optim as optim
from collections import deque


class DQNetwork(nn.Module):
    def __init__(self, input_dim):
        super(DQNetwork, self).__init__()
        self.network = nn.Sequential(
            nn.Linear(input_dim, 128),
            nn.ReLU(),
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Linear(64, 1)
        )

    def forward(self, x):
        return self.network(x)

class Recommender:
    def __init__(self, learning_rate: float = 0.001, feature_dim: int = 100):
        self.learning_rate = learning_rate
        self.feature_dim = feature_dim
        self.vectorizer = TfidfVectorizer(max_features=feature_dim)
        self.project_features = {}
        self.exploration_rate = 0.1
        self.memory = deque(maxlen=1000)
        self.batch_size = 32
        self.gamma = 0.95

        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.dqn = None
        self.target_dqn = None
        self.optimizer = None
        self.criterion = nn.MSELoss()

    def _extract_features(self, project: Project):
        """Extract features from a project using TF-IDF"""
        text = f"{project.name} {project.description} {' '.join(project.topics)}"

        if not self.project_features:
            features = self.vectorizer.fit_transform([text])
            if self.dqn is None:
                actual_dim = features.shape[1]
                self.dqn = DQNetwork(actual_dim).to(self.device)
                self.target_dqn = DQNetwork(actual_dim).to(self.device)
                self.target_dqn.load_state_dict(self.dqn.state_dict())
                self.optimizer = optim.Adam(self.dqn.parameters(), lr=self.learning_rate)
        else:
            features = self.vectorizer.transform([text])

        return features.toarray()[0]

    def add_project(self, project: Project):
        """Add a project to the recommendation system"""
        project_id = project.url
        if project_id not in self.project_features:
            features = self._extract_features(project)
            self.project_features[project_id] = features

    def get_project_score(self, project_id: str) -> float:
        """Calculate project score"""
        features = self.project_features[project_id]
        state = torch.FloatTensor(features).to(self.device)
        with torch.no_grad():
            return self.dqn(state).item()

    def recommend_projects(self, projects: List[Project], n: int = 3) -> List[Project]:
        """Recommend projects using epsilon greedy strategy with DQN"""
        for project in projects:
            self.add_project(project)

        scores = {}
        for project in projects:
            project_id = project.url
            if np.random.random() < self.exploration_rate:
                scores[project_id] = np.random.random()
            else:
                scores[project_id] = self.get_project_score(project_id)

        sorted_projects = sorted(projects, key=lambda p: scores[p.url], reverse=True)
        return sorted_projects[:n]

    def update_model(self, project: Project, feedback: str):
        """Update the model based on user feedback"""
        self.add_project(project)

        reward_map = {
            "like": 1.0,
            "maybe": 0.5,
            "dislike": 0.0
        }
        reward = reward_map[feedback.lower()]

        project_id = project.url
        state = self.project_features[project_id]

        self.memory.append((state, reward))

        if len(self.memory) >= self.batch_size:
            batch = random.sample(self.memory, self.batch_size)
            states = torch.FloatTensor([exp[0] for exp in batch]).to(self.device)
            rewards = torch.FloatTensor([exp[1] for exp in batch]).to(self.device)

            current_q_values = self.dqn(states)

            with torch.no_grad():
                target_q_values = rewards.unsqueeze(1) + self.gamma * self.target_dqn(states)

            loss = self.criterion(current_q_values, target_q_values)
            self.optimizer.zero_grad()
            loss.backward()
            self.optimizer.step()

            if np.random.random() < 0.1:
                self.target_dqn.load_state_dict(self.dqn.state_dict())

        self.exploration_rate *= 0.995


    def save_model(self, filepath: str):
        """Save the model to a file."""
        model_data = {
            'dqn_state_dict': self.dqn.state_dict(),
            'vectorizer': self.vectorizer,
            'project_features': self.project_features,
            'exploration_rate': self.exploration_rate
        }
        with open(filepath, 'wb') as f:
            pickle.dump(model_data, f)

    @classmethod
    def load_model(cls, filepath: str) -> 'Recommender':
        """Load the model from a file"""
        with open(filepath, 'rb') as f:
            model_data = pickle.load(f)

        recommender = cls()
        recommender.vectorizer = model_data['vectorizer']
        recommender.project_features = model_data['project_features']
        recommender.exploration_rate = model_data['exploration_rate']

        if recommender.project_features:
            first_feature = next(iter(recommender.project_features.values()))
            input_dim = len(first_feature)
            recommender.dqn = DQNetwork(input_dim).to(recommender.device)
            recommender.target_dqn = DQNetwork(input_dim).to(recommender.device)
            recommender.dqn.load_state_dict(model_data['dqn_state_dict'])
            recommender.target_dqn.load_state_dict(model_data['dqn_state_dict'])
            recommender.optimizer = optim.Adam(recommender.dqn.parameters(), lr=recommender.learning_rate)

        return recommender


def main():
    scraper = ProjectScraper()
    recommender = Recommender()

    tags = ["python", "machine-learning"]
    projects = scraper.search_projects(tags)

    recommended_projects = recommender.recommend_projects(projects, n=3)

    for project in recommended_projects:
        print(f"\nRecommended Project: {project.name}")
        print(f"Description: {project.description}")

        feedback = np.random.choice(['like', 'dislike', 'maybe'])
        print(f"Simulated feedback: {feedback}")

        recommender.update_model(project, feedback)

    recommender.save_model("recommender_model.pkl")


if __name__ == '__main__':
    main()