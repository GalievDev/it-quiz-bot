import {Bot, GrammyError, HttpError, InlineKeyboard, Keyboard} from "grammy";
import dotenv from "dotenv";
import {getAnswer, getQuizByName} from "./service/QuestionService";
import Question from "./dto/Question";

dotenv.config()
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
        reply_markup: startKeyboard.resized()
    }));
})

const userSessions: Record<number, { topic: string; currentIndex: number; score: number; quiz: Question[], messageId: number | null }> = {};

bot.hears(topics.flat(), async (ctx) => {
    const topic = ctx?.message?.text?.toLowerCase()!
    const questions = await getQuizByName(topic)
    userSessions[ctx.chatId] = { topic: topic, currentIndex: 0, score: 0, quiz: questions, messageId: null }

    await ctx.reply(`Starting the quiz on: ${topic}`)
    await sendQuestion(ctx, ctx.chatId)
})

async function sendQuestion(ctx: any, chatId: number) {
    const session = userSessions[chatId]
    const { quiz, currentIndex } = session
    const question = quiz[currentIndex]

    let message = `${currentIndex + 1}. ${question.text} \n\n`
    const buttonRows = question.options
        .filter(option => option.text !== null)
        .map((option, index) => {
            let letter = String.fromCharCode(97 + index)
            message += `${letter}. ${option?.text!!}\n`
            return [InlineKeyboard.text(
                `${letter}`,
                JSON.stringify({
                    isCorrect: option.isCorrect,
                    questionId: question.id
                })
            )]
        })

    console.log(question.options)

    let inlineKeyboard = InlineKeyboard.from(buttonRows)
    const sentMessage = await ctx.reply(`${message}`, {
        reply_markup: inlineKeyboard,
    });
    session.messageId = sentMessage.message_id
}

bot.on('callback_query:data', async (ctx) => {
    const session = userSessions[ctx?.chatId!!]
    const { quiz, messageId } = session;
    const callbackData = JSON.parse(ctx?.callbackQuery?.data)
    const answer = getAnswer(callbackData.questionId)

    if (messageId) {
        await ctx.api.deleteMessage(ctx?.chatId!!, messageId)
    }

    if (callbackData.isCorrect == "true") {
        session.currentIndex++;
        session.score++
        await ctx.reply("Right!")
    } else {
        if (answer !== null) {
            await ctx.reply(`Wrong Answer! \nThe question: ${quiz[session.currentIndex].text} \nRight answer: ${answer}`)
        } else {
            await ctx.reply("Wrong Answer!")
        }
        session.currentIndex++;
    }

    if (session.currentIndex >= quiz.length) {
        await ctx.reply(`Quiz over! You scored ${session.score} out of ${quiz.length}.`)
        delete userSessions[ctx?.chatId!!]
    } else {
        await sendQuestion(ctx, ctx?.chatId!!)
        await ctx.answerCallbackQuery()
    }
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