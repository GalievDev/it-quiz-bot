import {Column, Entity, PrimaryColumn} from "typeorm"

@Entity()
export class User {

    @PrimaryColumn()
    chatId: number = -1

    @Column()
    nickname: string = ""

    @Column()
    score: number = 0
}
