import React, {FormEvent, useEffect, useState} from 'react';
import {observer} from "mobx-react";
import {PostsStoreStatus, usePostsStore} from "../../store/PostsStore";
import Page from "../Page/Page";
import styles from "./PostsPage.module.css"
import {generatePath, useHistory, useRouteMatch} from "react-router-dom";
import Loader from "../Loader/Loader";
import PostMini from "./PostMini/PostMini";

type PostsPageParams = {
    page?: string
}

const PostsPage = observer(() => {
    const {posts, currentPage, countPerPage, maxPage, 
        getPosts, setPage, status} = usePostsStore();
    const history = useHistory();
    const match = useRouteMatch<PostsPageParams>();
    const [newPage, setNewPage] = useState("");
    
    useEffect(() => {
        const page = match.params.page ? 
            Number.isNaN(Number.parseInt(match.params.page)) ? 
                0 : 
                Number.parseInt(match.params.page) - 1 
            : 0;
        
        setPage(page);
        getPosts(page, countPerPage)
    }, [match.params.page])
    
    const handlePageChange = (e: FormEvent) => {
        e.preventDefault();
        
        const page = Number.parseInt(newPage)
        if (!Number.isNaN(page)) {
            if (page - 1 != currentPage) {
                handleSetPage(page - 1);
            }
        }
    }
    
    const handleSetPage = (page: number) => {
        history.push({
            pathname: generatePath(match.path, {page: (page + 1).toString()})
        })
    }
    
    return (
        <Page>
            <div className={styles.container}>
                <div className={styles.content_container}>
                {
                    status === PostsStoreStatus.GetPostsLoading ?
                        <Loader/> :
                        status === PostsStoreStatus.GetPostsError ?
                            <div>Error!</div> :
                            <>
                                <div className={styles.list}>
                                    {posts.map((post) => <PostMini key={post.id} post={post}/>)}
                                </div>
                                <div className={styles.pagination_container}>
                                    <button className={styles.button} disabled={currentPage <= 0}
                                            onClick={() => handleSetPage(currentPage - 1)}>
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
                                            onClick={() => handleSetPage(currentPage + 1)}>
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
