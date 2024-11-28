import {Composer, Keyboard} from "grammy";

const composer = new Composer();

const topics = [
    ['Linux', 'Bash', 'Docker'],
    ['Postgres', 'Laravel', 'DevOps'],
    ['cPanel', 'React', 'Django'],
    ['NodeJS', 'WordPress', 'Next.js'],
]

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