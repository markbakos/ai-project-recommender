# Project Recommender

## Table of Contents

+ [About](#about)
+ [Features](#features)
+ [Requirements](#requirements)
+ [Installation](#installation)
+ [Contributing](#contributing)
+ [Contact](#contact)

## About <a name = "about"></a>

This project is a personalized recommendation system that uses Deep Q-Learning to suggest GitHub projects tailored to user interests. It uses Reinforcement Learning (RL) to evaluate,
rank and improve project recommendations based on user feedback, allowing the user to easily rate the projects with a clean user-friendly UI.
<br><br>
Using GitHub's API, the "scraper" gathers projects in a user set range of stars and tags. The Deep Q-Network (DQN) learns optimal recommendation strategies by interacting with user
preferences. As users provide feedback on recommended projects ("like", "dislike", "maybe"), the model dynamically updates, improving the relevance of future suggestions.


## Features <a name = "features"></a>

**Data Handling:**

- Utilizes TF-IDF to encode project names, descriptions and topics into numerical vectors 
- Continuously updates the recommendation pool with newly fetched GitHub projects.
- Uses user feedback to adjust recommendation strategies in real-time. 
  
**Deep Reinforcement Learning:**

- **DQN Architecture**
    - Fully connected neural network with three layers, using ReLU activations for non-linear transformations.
    - Outputs a single Q-value representing the estimated reward for recommending a project.
- **Epsilon Greedy Strategy**: Balances exploration of new projects and exploitation of high value projects.

**Recommendations:**

- Suggests top projects based on learned Q-values.
- Dynamically adapts recommendations to user preferences over time.

**API:**

- I used **FastAPI** to make the backend to handle requests for predictions.

**UI:**

- Created the responsive frontend using **React**, **TypeScript** and **TailwindCSS**
- User friendly UI, saves starred projects and user preferences on browser's localstorage

## Requirements <a name = "requirements"></a>

### Prerequisites
1. **Python 3.10 or higher**: Install from [python.org](https://www.python.org/downloads/).
2. **pip**: Python package manager (comes with Python installations).
3. **Node.js (v14 or later)**: Install from [nodejs.org](https://nodejs.org/en/download/package-manager)

### Python Dependencies

Install the required Python packages from `requirements.txt` found in the root folder.

```
pip install -r requirements.txt
```

## Installation <a name = "installation"></a>

1. **Clone the repository**
```
 git clone https://github.com/markbakos/ufc-predictor.git
 cd ufc-predictor
```

2. **Set up environmental variables:**

   - In the root folder, in your .env file:

```
GITHUB_TOKEN=[your github token]
```

2. **Install dependencies for frontend**
```
cd client
npm install
```

3. **Start the development server**
- Frontend:
```
  cd client
  npm run dev
```
Or you can also use the deployed website https://findproject.onrender.com/

- Backend:
```
  # Make sure you are in root folder
  uvicorn app.server:app
```

5. **Open the app in your browser**<br>

Navigate to [http://localhost:5173](http://localhost:5173) or the address provided in your terminal to use the app.


## Contributing <a name = "contributing"></a>

Feel free to fork this repository, make changes, and submit a pull request.

## 📧 Contact <a name = "contact"></a>

For any inquiries, feel free to reach out:

Email: [markbakosss@gmail.com](mailto:markbakosss@gmail.com) <br>
GitHub: [markbakos](https://github.com/markbakos)
