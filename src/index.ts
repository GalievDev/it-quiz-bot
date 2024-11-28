import {Bot, GrammyError, HttpError} from "grammy";
import dotenv from "dotenv";
import Handler from "./handler/mod"
import Command from "./command/mod"

dotenv.config()
const bot = new Bot(process.env.TOKEN as string);

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

bot.use(Handler, Command)
bot.start()