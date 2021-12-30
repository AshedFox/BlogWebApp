import React from 'react';
import styles from './Header.module.css'
import BurgerMenu from "./BurgerMenu/BurgerMenu";
import {routes} from "../../../constants/routes";
import {Link} from 'react-router-dom';
import {observer} from "mobx-react";
import {useAccountStore} from "../../../store/AccountStore";
import {AuthModalStatus, useAuthModalStore} from "../../../store/AuthModalStore";

const Header = observer(() => {
    const {account} = useAccountStore();
    const {setStatus} = useAuthModalStore();
    
    return (
        <div className={styles.header}>
            <div className={styles.container}>
                <div className={styles.body}>
                    <nav className={styles.navigation}>
                        <div className={styles.links_list}>
                            <Link className={styles.link} to={routes.posts}>Статьи</Link>
                        </div>
                    </nav>
                    {
                        account !== undefined ?
                            <BurgerMenu/> : 
                            <div className={styles.link} onClick={() => setStatus(AuthModalStatus.Opened)}>Войти</div>
                    }
                </div>
            </div>
        </div>
    );
});

export default Header;
