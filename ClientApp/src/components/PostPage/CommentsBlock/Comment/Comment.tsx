import React, {FC} from 'react';
import {CommentModel} from "../../../../models/CommentModel";
import styles from "./Comment.module.css";
import {Link} from "react-router-dom";
import {routes} from "../../../../constants/routes";
import Mark from "../../../Mark/Mark";
import {observer} from "mobx-react";
import {useAccountStore} from "../../../../store/AccountStore";
import {usePostsStore} from "../../../../store/PostsStore";
import {CommentMarkToAddDto} from "../../../../DTOs/CommentMarkToAddDto";
import {CommentMarkToEditDto} from "../../../../DTOs/CommentMarkToEditDto";

type CommentProps = {
    comment: CommentModel,
    replyLevel: number
}

const Comment: FC<CommentProps> = observer(({comment, replyLevel}) => {
    const {account} = useAccountStore();
    const {markComment, unmarkComment, changeCommentMark, setCurrentPostCommentMarks} = usePostsStore();

    const handleMark = (vote: number) => {
        if (account) {
            const markToAdd: CommentMarkToAddDto = {
                commentId: comment.id,
                userId: account.userId,
                value: vote
            }

            markComment(markToAdd).then(
                (mark) => {
                    if (mark) {
                        setCurrentPostCommentMarks(comment.id,[...comment.marks, mark])
                    }
                }
            )
        }
    }

    const hadnleUnmark = () => {
        if (account) {
            const markToUnmark = comment.marks.find(mark => mark.userId === account.userId);

            if (markToUnmark) {
                unmarkComment(markToUnmark.id).then(
                    (value) => {
                        if (value) {
                            setCurrentPostCommentMarks(comment.id, comment.marks.filter(mark => mark !== markToUnmark))
                        }
                    }
                )
            }
        }
    }

    const handleChangeMark = (vote: number) => {
        if (account) {
            const markToEdit = comment.marks.find(mark => mark.userId === account.userId);

            if (markToEdit) {
                const newMark: CommentMarkToEditDto = {
                    id: markToEdit.id,
                    value: vote
                }

                changeCommentMark(markToEdit.id, newMark).then(
                    (value) => {
                        if (value) {
                            setCurrentPostCommentMarks(comment.id,
                                comment.marks.map(mark => {
                                    if (mark.id === markToEdit.id) {
                                        mark.value = vote;
                                    }
                                    return mark;
                                })
                            )
                        }
                    }
                )
            }
        }
    }
    
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
                {
                    account !== undefined ?
                        <Mark marks={comment.marks} isVotable={true} handleMark={handleMark}
                              handleUnmark={hadnleUnmark} handleChangeMark={handleChangeMark}
                        /> :
                        <Mark marks={comment.marks} isVotable={false}/>
                }
            </div>
        </div>
    );
});

export default Comment;