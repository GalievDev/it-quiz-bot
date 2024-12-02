import {Composer, Keyboard} from "grammy";
import {topics, userRepository} from "./types";
import {User} from "../entity/User";

const composer = new Composer();

interface UserState {
    step: string;
}

const userState: Record<number, UserState> = {};

composer.command("start", async (ctx) => {
    const userId = ctx?.from?.id!!;

    if (await userRepository.exists({ where: { chatId: ctx?.chatId } })) {
        return await ctx.reply("You are already registered! \nType /quiz command to start a new quiz");
    }

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

        let user = new User();
        user.chatId = ctx?.chatId;
        user.nickname = nickname;
        user.score = 0
        user.takenQuizzes = 0

        await userRepository.save(user);

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