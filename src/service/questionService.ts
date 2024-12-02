import axios from "axios";
import dotenv from "dotenv";
import {Option, Question} from "./types";

dotenv.config()
const URL = "https://quizapi.io/api/v1/questions"
const KEY = process.env.API_KEY as string
let questions: Question[] = []

// @ts-ignore
async function getQuizByName(name: string, difficulty: string): Promise<Question[]> {
    try {
        let quantity = 0
        switch (difficulty) {
            case "easy":
                quantity = 10
                break
            case "medium":
                quantity = 20
                break
            case "hard":
                quantity = 30
                break
        }
        const response = await axios.get(`${URL}?apiKey=${KEY}&limit=${quantity}&category=${name}&difficulty=${difficulty}`)

        return response.data.map((question: any) => {
            const options = Object.keys(question.answers).map(key => {
                const answer = question.answers[key] as string
                const isCorrect = question.correct_answers[`${key}_correct`] as boolean

                return {
                    text: answer,
                    isCorrect: isCorrect,
                } as Option
            })

            const quest: Question = {
                id: question.id,
                text: question.question,
                hasMultipleChoices: question.multiple_correct_answers,
                options,
                answer: question.explanation,
                difficulty: question.difficulty,
            }
            questions.push(quest)
            return quest
        });
    } catch (error) {
        console.error(error)
    }
}

function getAnswer(id: number): string | null | undefined {
    return questions.find(question => question.id === id)?.answer
}

export { getQuizByName, getAnswer };
