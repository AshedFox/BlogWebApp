import React, {FormEvent, useEffect, useState} from 'react';
import {observer} from "mobx-react";
import {PostsStoreStatus, usePostsStore} from "../../store/PostsStore";
import PostMini from "./PostMini/PostMini";
import Page from "../Page/Page";
import styles from "./PostsPage.module.css"
import {useParams} from "react-router-dom";
import Loader from "../Loader/Loader";

const PostsPage = observer(() => {
    const {posts, currentPage, countPerPage, maxPage, 
        getPosts, setNextPage, setPrevPage, setPage, status} = usePostsStore();
    const {id} = useParams<{id:string}>();
    const [newPage, setNewPage] = useState((currentPage + 1).toString());
    
    useEffect(() => {
        return () => {
            setPage(0);
        }
    }, [])
    
    useEffect(() => {
        getPosts(currentPage, countPerPage);
        setNewPage((currentPage + 1).toString());
    }, [currentPage, countPerPage])
    
    const handlePageChange = (e:FormEvent) => {
        e.preventDefault();
        console.log(newPage);
        
        const page = Number.parseInt(newPage)
        if (!Number.isNaN(page)) {
            setPage(page - 1);
        }
    }
    
    return (
        <Page>
            <div className={styles.container}>
                <div className={styles.content_container}>
                {
                    status === PostsStoreStatus.Loading ?
                        <Loader/> :

                        status === PostsStoreStatus.Error ?
                            <div>Error!</div> :
                            <>
                                <div className={styles.list}>
                                    {posts.map((post) => <PostMini key={post.id} post={post}/>)}
                                </div>
                                <div className={styles.pagination_container}>
                                    <button className={styles.button} disabled={currentPage <= 0}
                                            onClick={setPrevPage}>
                                        {"<"}
                                    </button>
                                    <div className={styles.page_swap_container}>
                                        <div>
                                            <form onSubmit={handlePageChange}>
                                                <input className={styles.input} value={newPage}
                                                       type={"number"} min={1} max={maxPage}
                                                       placeholder={(currentPage + 1).toString()}
                                                       onChange={(e) => setNewPage(e.target.value)}>
                                                </input>
                                                <button type={"submit"} hidden/>
                                            </form>
                                        </div>
                                        <div>/ {maxPage}</div>
                                    </div>
                                    <button className={styles.button} disabled={currentPage >= maxPage - 1}
                                            onClick={setNextPage}>
                                        {">"}
                                    </button>
                                </div>
                            </>
                }
                </div>
            </div>
        </Page>
    );
});

export default PostsPage;
