import React, {FC} from 'react';
import {CommentModel} from "../../../models/CommentModel";
import Comment from "./Comment/Comment";
import styles from "./CommentsBlock.module.css";

type CommentsBlockProps = {
    comments: CommentModel[]
}

const CommentsBlock: FC<CommentsBlockProps> =  ({comments}) => {
    return (
        <div className={styles.container}>
            <div className={styles.title}>Комментарии({comments ? comments.length : 0})</div>
            <div className={styles.comments_list}>
                {
                    comments?.map((value) => <Comment key={value.id} comment={value} replyLevel={0}/>)
                }
            </div>
        </div>
    );
};

export default CommentsBlock;