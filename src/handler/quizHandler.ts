import {Composer} from "grammy";
import helpers from "../utils/helpers";
import {getQuizByName} from "../service/questionService";
import {topics} from "../command/types";

const composer = new Composer();

composer.hears(topics.flat(), async (ctx) => {
    const topic = ctx?.message?.text?.toLowerCase()!
    const questions = await getQuizByName(topic)
    helpers.userSessions[ctx.chatId] = { topic: topic, currentIndex: 0, score: 0, quiz: questions, messageId: null }

    await ctx.reply(`Starting the quiz on: ${topic}`, {
        reply_markup: {
            resize_keyboard: false,
            remove_keyboard: true
        }
    })
    await helpers.sendQuestion(ctx, ctx.chatId)
})

export default composer