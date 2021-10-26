import React from 'react';
import styles from './Header.module.css'
import BurgerMenu from "./BurgerMenu/BurgerMenu";
import {routes} from "../../../constants/routes";
import { Link } from 'react-router-dom';

const Header = () => {
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
                    <BurgerMenu/>
                </div>
            </div>
        </div>
    );
};

export default Header;
