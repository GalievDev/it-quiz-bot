import {Composer, Keyboard} from "grammy";

const composer = new Composer();

interface UserState {
    step: string;
}

const userState: Record<number, UserState> = {};

const topics = [
    ['Linux', 'Bash', 'Docker'],
    ['Postgres', 'Laravel', 'DevOps'],
    ['cPanel', 'React', 'Django'],
    ['NodeJS', 'WordPress', 'Next.js'],
]

composer.command("start", async (ctx) => {
    const userId = ctx?.from?.id!!;

    userState[userId] = { step: 'awaiting_nickname' };

    await ctx.reply("Hello 👋 \nI'm Quiz bot, I will test your knowledge by topic that you select 🤓");
    await ctx.reply("Now write your nickname:");
});

composer.on("message", async (ctx) => {
    const userId = ctx.from.id;

    const userCurrentState = userState[userId]

    if (userCurrentState.step === 'awaiting_nickname') {
        const nickname = ctx?.message?.text?.trim()!!;

        if (nickname.length === 0) {
            await ctx.reply("Please enter a valid nickname");
            return;
        }

        // Save the user to the database here

        const startKeyboard = topics.reduce((keyboard, row) => {
            row.forEach(text => keyboard.text(text));
            return keyboard.row();
        }, new Keyboard());

        await ctx.reply(`Nice to meet you ${nickname}! \nSelect the topic on the keyboard to start the quiz 👇`, {
            reply_markup: startKeyboard.resized()
        });

        delete userState[userId];
    }
});

export default composer