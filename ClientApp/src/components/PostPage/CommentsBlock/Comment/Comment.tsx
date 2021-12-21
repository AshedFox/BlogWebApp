import React, {FC} from 'react';
import {CommentModel} from "../../../../models/CommentModel";
import styles from "./Comment.module.css";
import {Link} from "react-router-dom";
import {routes} from "../../../../constants/routes";
import Mark from "../../../Mark/Mark";
import {observer} from "mobx-react";
import {useAccountStore} from "../../../../store/AccountStore";

type CommentProps = {
    comment: CommentModel,
    replyLevel: number
}

const Comment: FC<CommentProps> = observer(({comment, replyLevel}) => {
    const {account} = useAccountStore();
    
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link className={styles.creator} to={routes.profile+`/${comment.creator.id}`}>
                    {
                        comment.creator.avatar &&
                        <div className={styles.creator_avatar}>
                            <img className={styles.image} src={comment.creator.avatar.url} alt=""/>
                        </div>
                    }
                    <div>{comment.creator.name}</div>
                </Link>
                <div className={styles.date}>{new Date(comment.createdAt).toLocaleString()}</div>
            </div>
            <div className={styles.main}>
                <div className={styles.desc}>{comment.content}</div>
            </div>
            <div className={styles.footer}>
                <Mark totalMark={comment.totalMark} isVotable={account !== undefined}
                      handleVote={(param) => console.log(param)}/>
            </div>
        </div>
    );
});

export default Comment;