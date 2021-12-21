import React, {useEffect} from 'react';
import Page from "../Page/Page";
import {observer} from "mobx-react";
import styles from "./ProfilePage.module.css";
import {useRouteMatch} from "react-router-dom";
import {UsersStoreStatus, useUsersStore} from "../../store/UsersStore";
import Loader from "../Loader/Loader";
import defaultUserImage from "../../images/user.png"

type ProfilePageParams = {
    id: string
}

const ProfilePage = observer(() => {
    const {getUser, currentUser, status} = useUsersStore();
    const match = useRouteMatch<ProfilePageParams>();

    useEffect(() => {
        getUser(match.params.id);
    }, [])
    
    return (
        <Page>
            <div className={styles.container}>
                {
                    status === UsersStoreStatus.GetUserLoading || !currentUser ?
                        <Loader/> :
                        status === UsersStoreStatus.GetUserError ?
                            <div>ERROR!</div> :
                            <div className={styles.content}>
                                <div className={styles.user}>
                                    <div className={styles.avatar}>
                                        {
                                            currentUser.avatar ?
                                                <img className={styles.image} src={currentUser.avatar.url} alt=""/> :
                                                <img className={styles.image} src={defaultUserImage} alt=""/>
                                                
                                        }
                                    </div>
                                    <div className={styles.info}>
                                        <div className={styles.name}>{currentUser.name}</div>
                                        <div className={styles.email}>{currentUser.email}</div>
                                        <div className={styles.reg_date}>{new Date(currentUser.createdAt).toLocaleString()}</div>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <div>
                                            <div></div>
                                            <div>

                                            </div>
                                        </div>
                                        <div>
                                            <div></div>
                                            <div>

                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div>
                                            <div></div>
                                            <div>

                                            </div>
                                        </div>
                                        <div>
                                            <div></div>
                                            <div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                }
            </div>

        </Page>
    );
});

export default ProfilePage;