import {AppDataSource} from "../dataSource";
import {User} from "../entity/User";

export const topics = [
    ['Linux', 'Bash', 'Docker'],
    ['Postgres', 'Laravel', 'DevOps'],
    ['cPanel', 'React', 'Django'],
    ['NodeJS', 'WordPress', 'Next.js'],
]

export const userRepository = AppDataSource.getRepository(User)