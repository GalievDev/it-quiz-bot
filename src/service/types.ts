export interface Option {
    text: string | null,
    isCorrect: boolean,
}

export interface Question {
    id: number,
    text: string,
    hasMultipleChoices: boolean,
    options: Option[],
    answer: string | null,
    difficulty: string,
}