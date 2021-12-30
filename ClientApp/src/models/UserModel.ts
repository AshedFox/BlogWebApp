import {PostModel} from "./PostModel";
import {FileModel} from "./FileModel";
import {UserGender} from "./UserGender";

export interface UserModel {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
    selfInformation: string;
    bornAt: Date;
    gender: UserGender;
    avatar?: FileModel;
    posts: PostModel[];
}