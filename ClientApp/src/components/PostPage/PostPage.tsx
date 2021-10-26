import React from 'react';
import Page from "../Page/Page";
import styles from "./PostPage.module.css"

const PostPage = () => {
    return (
        <Page>
            <div className={styles.container}>
                <div className={styles.header}>
                    <span className={styles.creator}></span>
                    <span className={styles.date}></span>
                </div>
                <div className={styles.title}></div>
                <div className={styles.content}></div>
            </div>
        </Page>
    );
};

export default PostPage;
