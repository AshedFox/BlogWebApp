import React from 'react';
import {PostModel} from "../../../models/PostModel";
import styles from "./PostMini.module.css";
import {routes} from "../../../constants/routes";
import { Link } from 'react-router-dom';

type PostMiniProps = {
    post: PostModel
}

const PostMini = ({post}:PostMiniProps) => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span className={styles.creator}><Link to={routes.myProfile+`/${post.creator.id}`}>{post.creator.name}</Link></span>
                <span className={styles.date}>{new Date(post.createdAt).toLocaleString()}</span>
            </div>
            <div className={styles.title}><Link to={routes.posts+`/${post.id}`}>{post.title}</Link></div>
            <div className={styles.short_desc}>{post.content}</div>
        </div>
    );
};

export default PostMini;
