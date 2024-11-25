import axios from "axios";
import Question from "../dto/Question";
import Option from "../dto/Option";
import dotenv from "dotenv";

dotenv.config()
const URL = "https://quizapi.io/api/v1/questions"
const KEY = process.env.API_KEY as string

// @ts-ignore
async function getQuizByName(name: string, quantity?: number = 5): Promise<Question[]> {
    try {
        const response = await axios.get(`${URL}?apiKey=${KEY}&limit=${quantity}&category=${name}`)

        return response.data.map((question: any) => {
            const options = Object.keys(question.answers).map(key => {
                const answer = question.answers[key] as string
                const isCorrect = question.correct_answers[`${key}_correct`] as boolean

                return {
                    text: answer,
                    isCorrect: isCorrect,
                } as Option
            })

            return {
                id: question.id,
                text: question.question,
                hasMultipleChoices: question.multiple_correct_answers,
                options,
                difficulty: question.difficulty,
            }
        });
    } catch (error) {
        console.error(error)
    }
}

export { getQuizByName };
