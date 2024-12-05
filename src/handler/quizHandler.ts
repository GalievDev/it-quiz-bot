import {Composer, Keyboard} from "grammy";
import helpers from "../utils/helpers";
import {getQuizByName} from "../service/questionService";
import {topics} from "../command/types";

const composer = new Composer();

const difficulties = ["easy", "medium", "hard"]

composer.hears(topics.flat(), async (ctx) => {
    const topic = ctx?.message?.text!!
    helpers.userSessions[ctx.chatId] = { topic: topic.toLowerCase(), currentIndex: 0, score: 0, quiz: [], messageId: null }

    if (!topics.flat().includes(topic)) {
        await ctx.reply("This topic does not correspond to the topics below")
    }

    const difficultyKeyboard = difficulties.reduce((keyboard, text) => {
        keyboard.text(text)
        return keyboard;
    }, new Keyboard())

    await ctx.reply("Select difficulty of quiz: ", {
        reply_markup: difficultyKeyboard.resized()
    })
})

composer.hears(difficulties, async (ctx) => {
    const session = helpers.userSessions[ctx.chatId]
    const difficulty = ctx?.message?.text!!

    session.quiz = await getQuizByName(session.topic, difficulty)
    await ctx.reply(`Starting the quiz on: ${session.topic}`, {
        reply_markup: {
            resize_keyboard: false,
            remove_keyboard: true
        }
    })
    await helpers.sendQuestion(ctx, ctx.chatId)
})

export default composer