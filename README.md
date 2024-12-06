# IT Quiz Bot
**IT Quiz Bot** is a Telegram bot built using the [grammY](https://grammy.dev) framework, this bot provides an interactive quiz experience with multiple categories and difficulty levels.

## Features

- **Multiple Categories**: Quiz questions cover a wide range of IT topics such as programming, databases, networking, and more.
- **Difficulty Levels**: Choose from beginner, intermediate, or advanced quizzes.
- **Interactive Gameplay**: Instant feedback on your answers.
- **User Statistics**: Track your progress and see how well you're doing.

## Technologies Used

- **Node.JS** 
- **grammY** Telegram bot framework
- **TypeORM with PostgreSQL** for storing user statistics


## Setup and Installation

### Prerequisites

- **Node.JS** installed on your system
- **PostgreSQL** database
- Telegram Bot API Token (get it from [BotFather](https://core.telegram.org/bots#botfather))
- Quizzes API Token you can get it [here](quizapi.io/)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/GalievDev/it-quiz-bot.git
   cd it-quiz-bot
   ```

2. **Configure environment variables**:
   Create a `.env` file in the root directory with the following content:
   ```env
   TOKEN=your-telegram-bot-token
   API_KEY=your-quiz-api-key
   DB_HOST=your-db-url
   DB_PORT=your-db-port
   DB_USERNAME=your-username
   DB_PASSWORD=your-password
   DB_NAME=db-name
   ```

3. **Run with docker compose**:
   ```bash
   docker-compose up --build
   ```

4. The bot and PostgreSQL database will be running in Docker containers.

## Usage

- Start the bot by sending /start in Telegram.
- Select a category and difficulty level to begin the quiz.
- Answer the questions and get immediate feedback.

![image](https://github.com/user-attachments/assets/e35e753e-e305-4cd2-8da0-e4b9a04ec9d8)

![image](https://github.com/user-attachments/assets/83a89223-ab5c-49bf-a382-3e26d9caa381)

