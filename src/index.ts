import {Bot, GrammyError, HttpError, InlineKeyboard, Keyboard} from "grammy";
import dotenv from "dotenv";
import {getQuizByName} from "./service/fetcher";

console.log(dotenv.config())
const bot = new Bot(process.env.TOKEN as string);

const topics = [
    ['Linux', 'Bash', 'PHP', 'Docker', 'HTML'],
    ['Postgres', 'MySQL', 'Laravel', 'Kubernetes', 'JavaScript'],
    ['Python', 'Openshift', 'Terraform', 'React', 'Django'],
    ['cPanel', 'Ubuntu', 'NodeJS', 'WordPress', 'Next.js'],
]

bot.command("start", async (ctx) => {
    const startKeyboard = topics.reduce((keyboard, row) => {
        row.forEach(text => keyboard.text(text))
        return keyboard.row();
    }, new Keyboard())

    await ctx.reply("Hello! Welcome to the IT Quiz!📃");
    await ctx.reply("Select the topic that you want to test 👇", ({
        reply_markup: startKeyboard
    }));
})

bot.hears(topics.flat(), async (ctx) => {
    const topic = ctx?.message?.text?.toLowerCase()!
    const questions = await getQuizByName(topic)

    const buttonRows = questions[0].options
        .filter(option => option.text !== null)
        .map(option => [
        InlineKeyboard.text(
            option?.text!!,
            JSON.stringify({
                type: `${ctx?.message?.text?.toLowerCase()!!}-option`,
                isCorrect: option.isCorrect,
                questionId: questions[0].id,
            })
        )
    ])

    let inlineKeyboard = InlineKeyboard.from(buttonRows)
    await ctx.reply(questions[0].text, {
        reply_markup: inlineKeyboard,
    });
})

bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof GrammyError) {
        console.error("Error in request:", e.description);
    } else if (e instanceof HttpError) {
        console.error("Could not contact Telegram:", e);
    } else {
        console.error("Unknown error:", e);
    }
});

bot.start()