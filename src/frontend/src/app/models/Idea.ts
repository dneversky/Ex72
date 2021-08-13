import {User} from "./User";

export class Idea {
    id: string;
    title: string;
    text: string;
    status: string;
    rating: number;
    looks: number;
    author: User;
    date: Date;

    constructor(title: string, text: string, status: string) {
        this.title = title;
        this.text = text;
        this.status = status;
    }
}