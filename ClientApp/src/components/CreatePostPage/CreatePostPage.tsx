import React, {FormEvent, useEffect, useState} from 'react';
import Page from "../Page/Page";
import {observer} from "mobx-react";
import {PostsStoreStatus, usePostsStore} from "../../store/PostsStore";
import {PostToAddDto} from "../../DTOs/PostToAddDto";
import {useAccountStore} from "../../store/AccountStore";
import styles from "./CreatePostPage.module.css"
import Dropzone from 'react-dropzone'
import filesService from "../../services/filesService";
import {FileModel} from "../../models/FileModel";
import Loader from "../Loader/Loader";


const CreatePostPage = observer(() => {
    const {createPost, status} = usePostsStore();
    const {account, logout} = useAccountStore();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [file, setFile] = useState<FileModel>();
    const [isReady, setIsReady] = useState<boolean>(true);
    const maxContentLength = 100000;
    
    useEffect(() => {
        if (status === PostsStoreStatus.Success) {
            setTitle("");
            setContent("");
            setFile(undefined);
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
                creatorId: account!.user.id,
                coverId: file?.id
            }

            createPost(postToCreate);
        }
    }
    
    const handleFileDrop = async (file: File) => {
        setIsReady(false);
        const response = await filesService.postFile(file);

        if (response.status === 201) {
            const fileModel = await response.json() as FileModel;
            
            setFile(fileModel);
        }
        else {
            if (response.status === 401) {
                logout();
            }
        }
        setIsReady(true);
    }
    
    return (
        <Page>
            <div className={styles.container}>
                <form className={styles.form} onSubmit={handleCreatePost}>
                    <legend className={styles.title}>Написать статью</legend>
                    <Dropzone onDrop={acceptedFiles => handleFileDrop(acceptedFiles[0])} multiple={false}>
                        {({getRootProps, getInputProps}) => (
                            <section>
                                <div className={styles.dropzone} {...getRootProps()}>
                                    <input {...getInputProps()} accept={"image/*"}/>
                                    {
                                        file ?
                                            <img className={styles.cover_preview} src={file?.url}/> :
                                            <div className={styles.default_text}>
                                                {"Нажмите на область или перетащите в неё картинку для изменения обложки статьи"}
                                            </div>
                                    }
                                </div>
                            </section>
                        )}
                    </Dropzone>
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
                    <button className={styles.button} type={"submit"} disabled={!isReady}>Создать</button>
                </form>
            </div>
        </Page>
    );
});

export default CreatePostPage;