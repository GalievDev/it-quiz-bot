import Option from "./Option";

export default interface Question {
    id: number,
    text: string,
    hasMultipleChoices: boolean,
    options: Option[],
    difficulty: string,
}