import {InlineKeyboard} from "grammy";
import Question from "../dto/Question";

const userSessions: Record<number, { topic: string; currentIndex: number; score: number; quiz: Question[], messageId: number | null }> = {};

async function sendQuestion(ctx: any, chatId: number) {
    const session = userSessions[chatId]
    const { quiz, currentIndex } = session
    const question = quiz[currentIndex]

    let message = `${currentIndex + 1}. ${question.text} \n\n`
    const buttonRows = question.options
        .filter(option => option.text !== null)
        .map((option, index) => {
            let letter = String.fromCharCode(97 + index)
            message += `${letter}. ${option?.text!!}\n`
            return [InlineKeyboard.text(
                `${letter}`,
                JSON.stringify({
                    isCorrect: option.isCorrect,
                    questionId: question.id
                })
            )]
        })

    let inlineKeyboard = InlineKeyboard.from(buttonRows)
    const sentMessage = await ctx.reply(`${message}`, {
        reply_markup: inlineKeyboard,
    });
    session.messageId = sentMessage.message_id
}

export default { userSessions, sendQuestion };