import React, {useEffect, useState} from 'react';
import styles from "./ActivitySection.module.css";
import {PostModel} from "../../../models/PostModel";
import {CommentModel} from "../../../models/CommentModel";
import {CommentMarkModel} from "../../../models/CommentMarkModel";
import {PostMarkModel} from "../../../models/PostMarkModel";
import CreatedActivity from "./Activity/CreatedActivity";
import MarkedActivity from "./Activity/MarkedActivity";
import postsService from "../../../services/postsService";
import marksService from "../../../services/marksService";
import commentsService from "../../../services/commentsService";
import Loader from "../../Loader/Loader";

export enum ActionType {
    Marked,
    Created
}

export enum ItemType {
    Post,
    Comment
}

type Props = {
    title: string,
    userId: string,
    actionType: ActionType,
    itemType: ItemType
}

enum State {
    Loading,
    Error,
    Success
}

const ActivitySection = ({title, itemType, userId, actionType}:Props) => {
    const [items, setItems] = useState<CommentModel[]|PostModel[]|CommentMarkModel[]|PostMarkModel[]>([]);
    const [state, setState] = useState(State.Loading);
    
    useEffect(() => {
        getItems().then(() => setState(State.Success), () => setState(State.Success))
    }, [])
    
    const getItems = async () => {
        if (itemType === ItemType.Post) {
            if (actionType === ActionType.Created) {
                const res = await postsService.getUserPosts(userId);

                if (res.status === 200) {
                    setItems(await res.json());
                }
            }
            else if (actionType == ActionType.Marked) {
                const res = await marksService.getUserPostsMarks(userId);

                if (res.status === 200) {
                    setItems(await res.json());
                }
            }
        }
        else if (itemType === ItemType.Comment) {
            if (actionType === ActionType.Created) {
                const res = await commentsService.getUserComments(userId);

                if (res.status === 200) {
                    setItems(await res.json());
                }
            }
            else if (actionType == ActionType.Marked) {
                const res = await marksService.getUserCommentsMarks(userId);

                if (res.status === 200) {
                    setItems(await res.json());
                }
            }
        }
    }
    
    const renderItems = () => {
        if (state === State.Loading) {
            return <Loader/>
        }
        else if (state === State.Error){
            return <div>Не удалось загрузить данные!</div>
        }
        
        if (items.length === 0) {
            return <div>Тут пока пусто!</div>
        }
        
        switch (actionType) {
            case ActionType.Created: {
                return items.map(value => {
                    const item = value as PostModel|CommentModel;
                    return <CreatedActivity key={item.id} item={item}/>
                })
            }
            case ActionType.Marked: {
                return items.map(value => {
                    const item = value as PostMarkModel|CommentMarkModel;
                    return <MarkedActivity key={item.id} mark={item}/>
                })
            }
            default: {
                return <></>
            }
        }
    }
    
    return (
        <div className={styles.container}>
            <div className={styles.title}>{title}</div>
            <div className={styles.list}>{renderItems()}</div>
        </div>
    );
};

export default ActivitySection;