import {Composer} from "grammy";
import helpers from "../utils/helpers"
import {getAnswer} from "../service/questionService";
import {userRepository} from "../command/types";

const composer = new Composer();

composer.on('callback_query:data', async (ctx) => {
    const session = helpers.userSessions[ctx?.chatId!!]
    const { quiz, messageId } = session;
    const callbackData = JSON.parse(ctx?.callbackQuery?.data)
    const answer = getAnswer(callbackData.questionId)

    if (messageId) {
        await ctx.api.deleteMessage(ctx?.chatId!!, messageId)
    }

    if (callbackData.isCorrect == "true") {
        session.currentIndex++;
        session.score++
        await ctx.reply("✅ Right!")
    } else {
        if (answer !== null) {
            await ctx.reply(`🚫 Wrong Answer! \nThe question: ${quiz[session.currentIndex].text} \nRight answer: ${answer}`)
        } else {
            await ctx.reply("🚫 Wrong Answer!")
        }
        session.currentIndex++;
    }

    if (session.currentIndex >= quiz.length) {
        let user = await userRepository.findOneByOrFail({ chatId: ctx?.chatId }).catch(() => {
            throw new Error("User not found")
        })
        await userRepository.save({
            chatId: user.chatId,
            nickname: user.nickname,
            score: user.score + session.score,
            takenQuizzes: user.takenQuizzes + 1
        })
        await ctx.reply(`🎉 Quiz over! You scored ${session.score} out of ${quiz.length}. \nType /quiz to start a new quiz!`)
        delete helpers.userSessions[ctx?.chatId!!]
    } else {
        await helpers.sendQuestion(ctx, ctx?.chatId!!)
        await ctx.answerCallbackQuery()
    }
})

export default composer