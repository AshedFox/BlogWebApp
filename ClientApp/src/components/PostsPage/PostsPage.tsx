import React, {useCallback, useEffect, useRef, useState} from 'react';
import {observer} from "mobx-react";
import {PostsStoreStatus, usePostsStore} from "../../store/PostsStore";
import PostMini from "./PostMini/PostMini";
import Page from "../Page/Page";
import styles from "./PostsPage.module.css"
import {useParams} from "react-router-dom";

const PostsPage = observer(() => {
    const {posts, currentPage, countPerPage, maxPage, 
        getPosts, setNextPage, setPrevPage, status} = usePostsStore();
    const {id} = useParams<{id:string}>();
    
    useEffect(() => {
        getPosts(currentPage, countPerPage);
    }, [currentPage, countPerPage])
    
    return (
        <Page>
            <div className={styles.container}>
                {
                    status === PostsStoreStatus.Loading ?
                        <div>Loading...</div> :
                        status === PostsStoreStatus.Error ? 
                            <div>Error!</div> :
                            <div className={styles.list}>
                                {posts.map((post) => <PostMini key={post.id} post={post}/>)}
                            </div>
                }
                <div>
                    <button disabled={currentPage <= 0} onClick={setPrevPage}>Предыдущие</button>
                    <button disabled={currentPage >= maxPage - 1} onClick={setNextPage}>Следующие</button>
                </div>
            </div>
        </Page>
    );
});

export default PostsPage;
