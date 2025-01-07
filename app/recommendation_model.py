import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from typing import List
import pickle
from project_scraper import Project, ProjectScraper


class Recommender:
    def __init__(self, learning_rate: float = 0.01, feature_dim: int = 100):
        self.learning_rate = learning_rate
        self.feature_dim = feature_dim
        self.vectorizer = TfidfVectorizer(max_features=feature_dim)
        self.weights = None
        self.project_features = {}
        self.exploration_rate = 0.1

    def _extract_features(self, project: Project):
        """Extract features from a project using TF-IDF"""
        text = f"{project.name} {project.description} {' '.join(project.topics)}"

        if not self.project_features:
            features = self.vectorizer.fit_transform([text])
            if self.weights is None:
                actual_dim = features.shape[1]
                self.weights = np.zeros(actual_dim)
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
        score = np.dot(features, self.weights)
        return score

    def recommend_projects(self, projects: List[Project], n: int = 3) -> List[Project]:
        """Recommend projects using epsilon greedy strategy"""
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
        features = self.project_features[project_id]

        predicted_reward = np.dot(features, self.weights)
        error = reward - predicted_reward
        self.weights += self.learning_rate * error * features

        self.exploration_rate *= 0.995

    def save_model(self, filepath: str):
        """Save the model to a file."""
        model_data = {
            'weights': self.weights,
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
        recommender.weights = model_data['weights']
        recommender.vectorizer = model_data['vectorizer']
        recommender.project_features = model_data['project_features']
        recommender.exploration_rate = model_data['exploration_rate']
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