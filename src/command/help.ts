import {Composer} from "grammy";

const composer = new Composer();

composer.command("help", async (ctx) => {
    await ctx.reply("/help - show all possible commands \n/quiz - start a new quiz \n/statistics - show global quizzes statistics", {
        reply_markup: {
            remove_keyboard: true
        }
    });
})

export default composer;