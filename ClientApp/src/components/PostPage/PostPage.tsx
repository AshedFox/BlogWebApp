import React, {useEffect, useRef} from 'react';
import Page from "../Page/Page";
import {observer} from "mobx-react";
import {useRouteMatch} from "react-router-dom";
import {PostsStoreStatus, usePostsStore} from "../../store/PostsStore";
import Post from "./Post/Post";
import CommentsBlock from "./CommentsBlock/CommentsBlock";
import styles from "./PostPage.module.css";
import NewComment from "./NewComment/NewComment";
import {CommentToAddDto} from "../../DTOs/CommentToAddDto";
import {useAccountStore} from "../../store/AccountStore";
import Loader from "../Loader/Loader";

type PostPageParams = {
    id: string
}

const PostPage = observer(() => {
    const ref = useRef(null);
    //const inViewport = useIntersection(ref);
    const {currentPost, getPost, status, createComment, getComments, setCurrentPost} = usePostsStore();
    const {account} = useAccountStore();
    const match = useRouteMatch<PostPageParams>();
    
    useEffect(() => {
        getPost(match.params.id).then((value) => {
            if (value) {
                getComments(value.id)
            }
        })
        
        return () => {
            setCurrentPost(undefined);
        }
    }, [])
    
    const handleComment = (comment: string) => {
        if (account) {
            const commentToAdd: CommentToAddDto = {
                postId: currentPost!.id,
                creatorId: account.userId,
                content: comment
            }
            
            createComment(commentToAdd).then(
                (value) => {
                    if (value) {
                        getComments(currentPost?.id);
                    }
                }
            );
        }
    }
    
    return (
        <Page>
            {
                status === PostsStoreStatus.GetPostLoading ?
                    <Loader/> :
                    status === PostsStoreStatus.GetPostError || !currentPost ?
                        <div>ERROR!</div> :
                        <div className={styles.container}>
                            <Post post={currentPost}/>
                            <div ref={ref}>
                                <CommentsBlock comments={currentPost.comments}/>
                            </div>
                            {account && <NewComment handleComment={(comment) => handleComment(comment)}/>}
                        </div>
            }
        </Page>
    );
});

export default PostPage;
