import random
from dataclasses import dataclass
from typing import List, Optional
from datetime import datetime
from dotenv import load_dotenv
import os
import requests

@dataclass
class Project:
    name: str
    description: str
    url: str
    stars: int
    language: str
    topics: List[str]
    last_updated: datetime

class ProjectScraper:
    def __init__(self, github_token: Optional[str] = None):
        dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
        load_dotenv(dotenv_path)
        self.github_token = github_token or os.getenv('GITHUB_TOKEN')
        self.headers = {
            'Authorization': f'token {self.github_token}',
            'Accept': 'application/vnd.github.v3+json'
        }
        self.base_url = "https://api.github.com"

    def search_projects(self, tags: List[str], min_stars: int = 10) -> List[Project]:
        """Search projects based of tags/topics and returns List of Projects"""

        query = f"stars:>={min_stars} " + " ".join(f"topic:{tag}" for tag in tags)
        url = f"{self.base_url}/search/repositories"

        params = {
            'q': query,
            'sort': 'stars',
            'per_page': 100
        }

        response = requests.get(url, headers=self.headers, params=params)
        response.raise_for_status()

        projects = []
        for item in response.json()['items']:
            project = Project(
                name=item['name'],
                description=item['description'] or "",
                url=item['html_url'],
                stars=item['stargazers_count'],
                language=item['language'] or "Not specified",
                topics=item['topics'],
                last_updated=datetime.strptime(item['updated_at'], '%Y-%m-%dT%H:%M:%SZ')
            )
            projects.append(project)

        return projects

    def get_random_project(self, tags: List[str]) -> Optional[Project]:
        """Get a random project from search results"""
        projects = self.search_projects(tags)
        return random.choice(projects) if projects else None

def main():
    """Test usage"""
    scraper = ProjectScraper()
    tags = ["python", "machine-learning"]

    try:
        project = scraper.get_random_project(tags)
        if project:
            print(f"Random Project:")
            print(f"Name: {project.name}")
            print(f"Description: {project.description}")
            print(f"URL: {project.url}")
            print(f"Stars: {project.stars}")
            print(f"Language: {project.language}")
            print(f"Topics: {', '.join(project.topics)}")
        else:
            print("No projects found with the given tags.")
    except Exception as e:
        print(f"Error {str(e)}")

if __name__ == '__main__':
    main()