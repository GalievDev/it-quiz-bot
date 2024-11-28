import {Composer} from "grammy";
import callbackQuery from "./callbackQuery";
import quizHandler from "./quizHandler";

const composer = new Composer();

composer.use(callbackQuery, quizHandler)

export default composer