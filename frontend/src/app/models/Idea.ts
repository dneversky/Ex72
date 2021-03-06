import {User} from "./User";
import {Tag} from "./Tag";
import {Status} from "./Status";

export class Idea {
    id: string;
    title: string;
    body: string;
    status: Status;
    rating: number;
    looks: number;
    createdDate: Date;
    tags: Tag[];
    images: string[];
    files: Map<string, string>;
    author: User;
    removeImages: string[];
    removeFiles: string[];
    ratedUsers: User[];
    unratedUsers: User[];
}