import React, {useState} from 'react';
import styles from "./BurgerMenu.module.css"
import {routes} from "../../../../constants/routes";
import {useAccountStore} from "../../../../store/AccountStore";
import { Link } from 'react-router-dom';

enum Status {
    Closed,
    Opened,
    Closing
}

const BurgerMenu = () => {
    const {logout, account} = useAccountStore();
    const [status, setStatus] = useState<Status>(Status.Closed);

    return (
        <div className={`${styles.menu} ${status === Status.Opened ? styles.active : ""}`}>
            <div className={styles.button} onClick={() => {
                if (status === Status.Opened) {
                    setStatus(Status.Closing);
                }
                else {
                    setStatus(Status.Opened);
                }
            }}>
                <span/>
            </div>
            {
                status !== Status.Closed &&
                <div className={`${styles.list} ${status === Status.Closing ? styles.closing : ""}`}
                     onAnimationEnd={() => {
                         if (status === Status.Closing) {
                             setStatus(Status.Closed)
                         }
                     }}
                >
                    <Link to={routes.profile + `/${account?.userId}`} className={styles.list_item}>Профиль</Link>
                    <Link to={routes.createPost} className={styles.list_item}>Написать статью</Link>
                    <div className={styles.list_item} onClick={logout}>Выход из аккаунта</div>
                </div>
            }
        </div>
    );
};

export default BurgerMenu;
