import React from 'react';
import {PostModel} from "../../../models/PostModel";
import styles from "./Post.module.css";
import {routes} from "../../../constants/routes";
import {Link} from 'react-router-dom';
import Mark from "../../Mark/Mark";
import {observer} from "mobx-react";
import {useAccountStore} from "../../../store/AccountStore";

type PostProps = {
    post: PostModel
}

const Post = observer(({post}:PostProps) => {
    const {account} = useAccountStore();
    
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link className={styles.creator} to={routes.profile+`/${post.creator.id}`}>
                    {
                        post.creator.avatar &&
                        <div className={styles.creator_avatar}>
                            <img className={styles.image} src={post.creator.avatar.url} alt=""/>
                        </div>
                    }
                    <div>{post.creator.name}</div>
                </Link>
                <div className={styles.date}>{new Date(post.createdAt).toLocaleString()}</div>
            </div>
            <div className={styles.main}>
                <div className={styles.title}>{post.title}</div>
                {
                    post.cover &&
                    <div className={styles.cover_container}>
                        <img className={styles.image} src={post.cover.url} alt="обложка статьи"/>
                    </div>
                }
                <div className={styles.desc}>{post.content}</div>
            </div>
            <div className={styles.footer}>
                <Mark totalMark={post.totalMark} isVotable={account !== undefined}
                      handleVote={(param) => console.log(param)}/>
            </div>
        </div>
    );
});

export default Post;
