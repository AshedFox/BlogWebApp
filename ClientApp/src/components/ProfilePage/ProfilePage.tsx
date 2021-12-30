import React, {useEffect} from 'react';
import Page from "../Page/Page";
import {observer} from "mobx-react";
import styles from "./ProfilePage.module.css";
import {useRouteMatch} from "react-router-dom";
import {UsersStoreStatus, useUsersStore} from "../../store/UsersStore";
import Loader from "../Loader/Loader";

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
                            <div>Возникла ошибка при получении данных профиля!</div> :
                            <div className={styles.content}>
                                <div className={styles.user}>
                                    <div className={styles.avatar}>
                                        {
                                            currentUser.avatar ?
                                                <img className={styles.image} src={currentUser.avatar.url} alt=""/> :
                                                <svg className={styles.image} version="1.0" xmlns="http://www.w3.org/2000/svg"
                                                     viewBox="0 0 128.000000 128.000000" preserveAspectRatio="xMidYMid meet"
                                                >
                                                    <g transform="translate(0.000000,128.000000) scale(0.100000,-0.100000)" stroke="none">
                                                        <path d="M543 1266 c-199 -63 -281 -290 -167 -462 122 -184 390 -183 512 1 36 55 57 141 48 202 -26 189 -216 314 -393 259z"/>
                                                        <path d="M296 645 c-53 -19 -102 -69 -136 -140 -35 -74 -50 -153 -50 -265 0 -110 23 -161 95 -205 l48 -30 363 -3 c240 -2 377 1 404 8 51 14 108 63 131 115 48 105 5 357 -78 456 -31 37 -115 79 -158 79 -16 0 -71 -20 -121 -46 -77 -39 -99 -46 -150 -46 -64 -1 -120 18 -195 64 -51 31 -93 35 -153 13z"/>
                                                    </g>
                                                </svg>                                             
                                        }
                                    </div>
                                    <div className={styles.info}>
                                        <div className={styles.name}>{currentUser.name}</div>
                                        <div className={styles.email}>{currentUser.email}</div>
                                        <div className={styles.reg_date}>с {new Date(currentUser.createdAt).toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>
                }
            </div>

        </Page>
    );
});

export default ProfilePage;