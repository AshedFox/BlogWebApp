import React from 'react';
import styles from './Header.module.css'
import BurgerMenu from "./BurgerMenu/BurgerMenu";
import {routes} from "../../../constants/routes";
import { Link } from 'react-router-dom';
import {observer} from "mobx-react";
import {useAccountStore} from "../../../store/AccountStore";

const Header = observer(() => {
    const {account} = useAccountStore();
    
    return (
        <div className={styles.header}>
            <div className={styles.container}>
                <div className={styles.body}>
                    <nav className={styles.navigation}>
                        <div className={styles.links_list}>
                            <Link className={styles.link} to={routes.main}>Главная</Link>
                            <Link className={styles.link} to={routes.posts}>Статьи</Link>
                        </div>
                    </nav>
                    {
                        account ?
                            <BurgerMenu/> : 
                            <Link className={styles.link} to={routes.login}>Войти</Link>
                    }
                </div>
            </div>
        </div>
    );
});

export default Header;
