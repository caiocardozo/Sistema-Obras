import { Construction } from './../construction/construction';

export class Comment {
    id: number;
    constructionId: number;
    natureId: number;
    date: string;
    text: string;
    dateOfGeneration: Date;
    UserIdRegistered: number;
    construction: Construction;
}
