import {Composer} from "grammy";
import start from "./start";
import help from "./help";
import quiz from "./quiz";
import statistics from "./statistics";

const composer = new Composer();

composer.use(statistics, quiz, help, start);

export default composer