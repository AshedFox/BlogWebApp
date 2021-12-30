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
    const [searchTitle, setSearchTitle] = useState("");
    const [searchStartDateTime, setSearchStartDateTime] = useState("");
    const [searchEndDateTime, setSearchEndDateTime] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);
    
    useEffect(() => {
        handleGetPosts();
    }, [match.params.page, searchTitle, searchStartDateTime, searchEndDateTime])
    
    const handlePageChange = (e: FormEvent) => {
        e.preventDefault();
        
        const page = Number.parseInt(newPage)
        if (!Number.isNaN(page)) {
            if (page - 1 !== currentPage) {
                handleSetPage(page - 1);
            }
        }
    }
    
    const handleSetPage = (page: number) => {
        history.push({
            pathname: generatePath(match.path, {page: (page + 1).toString()}),
            state: {searchTitle, searchStartDateTime, searchEndDateTime}
        })
    }
    
    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        handleGetPosts();
    }
    
    const handleGetPosts = () => {
        const page = match.params.page ?
            Number.isNaN(Number.parseInt(match.params.page)) ?
                0 :
                Number.parseInt(match.params.page) - 1
            : 0;

        getPosts(page, countPerPage, undefined, searchTitle, searchStartDateTime, searchEndDateTime)
            .then((value) => {
                if (value && value.posts.length > 0) {
                    setPage(page)
                }
                else {
                    handleSetPage(0)
                }
            })
    }

    const handleResetSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        setSearchTitle("");
        setSearchStartDateTime("");
        setSearchEndDateTime("");
    }

    return (
        <Page>
            <div className={styles.container}>
                <div className={styles.content_container}>
                    <div className={styles.posts}>
                    {
                        status === PostsStoreStatus.GetPostsLoading || !posts ?
                            <Loader/> :
                            status === PostsStoreStatus.GetPostsError ?
                                <div className={styles.message}>Возникла ошибка при загрузке данных статей!</div> :
                                posts.length === 0 ?
                                    <div className={styles.message}>Упс! Не найдено ни одной статьи!</div> :
                                    <>
                                        <div className={styles.list}>
                                            {posts.map((post) => <PostMini key={post.id} post={post}/>)}
                                        </div>
                                        <div className={styles.pagination}>
                                            <button className={styles.button} disabled={currentPage <= 0}
                                                    onClick={() => handleSetPage(currentPage - 1)}>
                                                {"<"}
                                            </button>
                                            <div className={styles.page_swap}>
                                                <div>
                                                    <form onSubmit={handlePageChange}>
                                                        <input className={styles.input} value={newPage}
                                                               type={"number"} min={1} max={maxPage}
                                                               placeholder={(currentPage + 1).toString()}
                                                               onChange={(e) => setNewPage(e.target.value)}/>
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
                    <div className={styles.filters}>
                        <div className={styles.title}>Поиск</div>
                        <form className={`${styles.filters_form} ${isExpanded ? "" : styles.collapsed}`} 
                              onSubmit={e => handleSearch(e)}
                              onReset={e => handleResetSearch(e)}
                        >
                            <input className={styles.input} name={"title"} placeholder={"Текст для поиска..."}
                                   value={searchTitle} onChange={e => setSearchTitle(e.target.value)}/>
                            <div className={styles.set}>
                                <div className={styles.title}>Время создания</div>
                                <div className={styles.field}>
                                    <label htmlFor={"start_datetime"} className={styles.label}>{"От: "}</label>
                                    <input id={"start_datetime"} className={styles.input} name={"start_datetime"}
                                           value={searchStartDateTime} onChange={e => setSearchStartDateTime(e.target.value)}
                                           type={"datetime-local"}/>
                                </div>
                                <div className={styles.field}>
                                    <label htmlFor={"end_datetime"} className={styles.label}>{"До: "}</label>
                                    <input id={"end_datetime"} className={styles.input} name={"end_datetime"}
                                           value={searchEndDateTime} onChange={e => setSearchEndDateTime(e.target.value)}
                                           type={"datetime-local"}/>
                                </div>
                            </div>
                            <div className={styles.buttons_block}>
                                <button className={styles.submit_button} type={"submit"}>Поиск</button>
                                <button className={styles.reset_button} type={"reset"}>Сбросить</button>
                            </div>
                        </form>
                        <div className={styles.roll} onClick={() => setIsExpanded(!isExpanded)}>
                            <div className={styles.arrow}>{isExpanded ? "▲" : "▼"}</div>
                            <div className={styles.text}>{isExpanded ? "Свернуть" : "Развернуть"}</div>
                        </div>
                    </div>
                </div>
            </div>
        </Page>
    );
});

export default PostsPage;
