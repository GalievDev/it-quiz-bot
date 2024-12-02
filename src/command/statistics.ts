import {Composer} from "grammy";
import {userRepository} from "./types";

const composer = new Composer();

composer.command("statistics", async (ctx) => {
    const chatId = ctx?.chatId!!
    let user = await userRepository.findOneByOrFail({ chatId: chatId }).catch(() => {
        throw new Error("User not found")
    })

    await ctx.reply(`Nickname: ${user.nickname} \nScore: ${user.score} \nTaken quizzes: ${user.takenQuizzes}`, {
        reply_markup: {
            remove_keyboard: true
        }
    })
})

export default composer