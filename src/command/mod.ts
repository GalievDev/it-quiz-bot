import {Composer} from "grammy";
import start from "./start";
import help from "./help";
import quiz from "./quiz";

const composer = new Composer();

composer.use(quiz, help, start);

export default composer