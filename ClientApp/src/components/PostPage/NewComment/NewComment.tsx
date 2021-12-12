import React, {ClassAttributes, FC, FormEvent, MutableRefObject, Ref, RefAttributes, RefObject, useState} from 'react';
import styles from "./NewComment.module.css";

type NewCommentProps = {
    handleComment: (comment: string) => void
}

const NewComment:FC<NewCommentProps> = ({handleComment}) => {
    const [comment, setComment] = useState<string>("");
    
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        setComment(comment.trim());
        
        if (comment.length > 0) {
            handleComment(comment);
            setComment("");
        }
    }
    
    return (
        <div className={styles.container}>
            <div className={styles.title}>Написать комментарий</div>
            <form className={styles.form} onSubmit={(e) => handleSubmit(e)}>
                <textarea className={styles.textarea} value={comment} maxLength={1000} rows={5}
                          onChange={(e) => setComment(e.target.value)}
                />
                <button className={styles.button} disabled={comment.trim().length <= 0}>Отправить</button>
            </form>
        </div>
    );
};

export default NewComment;