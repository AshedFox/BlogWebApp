import React, {FormEvent, useEffect, useState} from 'react';
import Page from "../Page/Page";
import {observer} from "mobx-react";
import {PostsStoreStatus, usePostsStore} from "../../store/PostsStore";
import {PostToAddDto} from "../../DTOs/PostToAddDto";
import {useAccountStore} from "../../store/AccountStore";
import styles from "./CreatePostPage.module.css"


const CreatePostPage = observer(() => {
    const {createPost, status} = usePostsStore();
    const {account} = useAccountStore();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const maxContentLength = 100000;
    
    useEffect(() => {
        if (status === PostsStoreStatus.Success) {
            setTitle("");
            setContent("");
        }
    }, [status])
    
    const handleCreatePost = (e: FormEvent) => {
        e.preventDefault();
        
        setTitle(title.trim());
        setContent(content.trim());
        
        if (title.length > 0 && content.length > 0) {
            const postToCreate: PostToAddDto = {
                title: title,
                content: content,
                creatorId: account!.user.id
            }

            createPost(postToCreate);
        }
    }
    
    return (
        <Page>
            <div className={styles.container}>
                <form className={styles.form} onSubmit={handleCreatePost}>
                    <legend className={styles.title}>Написать статью</legend>
                    <input className={styles.input} name={"title"} value={title} 
                           placeholder={"Заголовок статьи"} maxLength={100}
                           onChange={(e) => setTitle(e.target.value)}
                    />
                    <textarea className={styles.textarea} name={"content"} value={content} maxLength={maxContentLength}
                              placeholder={"Содержание статьи"}
                              onChange={(e) => setContent(e.target.value)}
                    />
                    {
                        content.length / maxContentLength < 0.9 ?
                            <small className={styles.limit}>{`${content.length}/${maxContentLength}`}</small> :
                            <small className={`${styles.limit} ${styles.limit_low}`}>
                                {`${content.length}/${maxContentLength}`}
                            </small>
                    }
                    <button className={styles.button} type={"submit"}>Создать</button>
                </form>
            </div>
        </Page>
    );
});

export default CreatePostPage;