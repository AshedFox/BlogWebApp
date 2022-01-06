import React from 'react';
import {PostModel} from "../../../models/PostModel";
import styles from "./Post.module.css";
import {routes} from "../../../constants/routes";
import {Link} from 'react-router-dom';
import Mark, {MarkViewType} from "../../Mark/Mark";
import {observer} from "mobx-react";
import {useAccountStore} from "../../../store/AccountStore";
import {PostMarkToAddDto} from "../../../DTOs/PostMarkToAddDto";
import {usePostsStore} from "../../../store/PostsStore";
import {PostMarkToEditDto} from "../../../DTOs/PostMarkToEditDto";

type PostProps = {
    post: PostModel
}

const Post = observer(({post}:PostProps) => {
    const {account} = useAccountStore();
    const {markPost, unmarkPost, changePostMark, setCurrentPostMarks} = usePostsStore();
    
    const handleMark = (vote: number) => {
        if (account) {
            const markToAdd: PostMarkToAddDto = {
                postId: post.id,
                userId: account.userId,
                value: vote
            }

            markPost(markToAdd).then(
                (mark) => {
                    if (mark) {
                        setCurrentPostMarks([...post.marks, mark])
                    }
                }
            )
        }
    }
    
    const hadnleUnmark = () => {
        if (account) {
            const markToUnmark = post.marks.find(mark => mark.userId === account.userId);
            
            if (markToUnmark) {
                unmarkPost(markToUnmark.id).then(
                    (value) => {
                        if (value) {
                            setCurrentPostMarks(post.marks.filter(mark => mark !== markToUnmark))
                        }
                    }
                )
            }
        }
    }
    
    const handleChangeMark = (vote: number) => {
        if (account) {
            const markToEdit = post.marks.find(mark => mark.userId === account.userId);

            if (markToEdit) {
                const newMark: PostMarkToEditDto = {
                    id: markToEdit.id,
                    value: vote
                }
                
                changePostMark(markToEdit.id, newMark).then(
                    (value) => {
                        if (value) {
                            setCurrentPostMarks(
                                post.marks.map(mark => {
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
                {
                    account !== undefined ?
                        <Mark marks={post.marks} isVotable={true} userToCheckMarkId={account.userId} 
                              handleMark={handleMark} handleUnmark={hadnleUnmark} handleChangeMark={handleChangeMark}
                        /> :
                        <Mark marks={post.marks} isVotable={false} viewType={MarkViewType.OnlyTotal}/>
                }
            </div>
        </div>
    );
});

export default Post;
