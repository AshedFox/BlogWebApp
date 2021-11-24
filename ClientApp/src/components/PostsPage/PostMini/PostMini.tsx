import React from 'react';
import {PostModel} from "../../../models/PostModel";
import styles from "./PostMini.module.css";
import {routes} from "../../../constants/routes";
import {Link} from 'react-router-dom';

type PostMiniProps = {
    post: PostModel
}

const PostMini = ({post}:PostMiniProps) => {
    console.log(post.creator.avatar)
    
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link className={styles.creator} to={routes.myProfile+`/${post.creator.id}`}>
                    {
                        post.creator.avatar &&
                        <div className={styles.creator_avatar}>
                            <img className={styles.image} src={post.creator.avatar.url}/>
                        </div>
                    }
                    <div>{post.creator.name}</div>
                </Link>
                <div className={styles.date}>{new Date(post.createdAt).toLocaleString()}</div>
            </div>
            <div className={styles.title}><Link to={routes.posts+`/${post.id}`}>{post.title}</Link></div>
            {
                post.cover && 
                <div className={styles.cover_container}>
                    <img className={styles.image} src={post.cover.url} alt="обложка статьи"/>
                </div>
            }
            <div className={styles.short_desc}>
                {post.content.length > 2000 ? 
                    post.content.substr(0, 2000) + "..." :
                    post.content}
            </div>
        </div>
    );
};

export default PostMini;
