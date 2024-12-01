import {Composer, Keyboard} from "grammy";
import {topics} from "./types";

const composer = new Composer();

composer.command("quiz", async (ctx) => {
    const startKeyboard = topics.reduce((keyboard, row) => {
        row.forEach(text => keyboard.text(text))
        return keyboard.row();
    }, new Keyboard())
    await ctx.reply("Select the topic on keyboard for starting quiz 👇", {
        reply_markup: startKeyboard.resized(),
    })
})

export default composer