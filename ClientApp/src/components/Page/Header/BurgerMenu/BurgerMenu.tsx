import React, {useState} from 'react';
import styles from "./BurgerMenu.module.css"
import {routes} from "../../../../constants/routes";
import AccountStore from "../../../../store/AccountStore";
import { Link } from 'react-router-dom';

const BurgerMenu = () => {
    const {logout} = AccountStore
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={isOpen ? styles.menu.concat(" active") : styles.menu}>
            <div className={styles.button} onClick={() => setIsOpen(!isOpen)}>
                <span/>
            </div>
            <div className={styles.list}>
                <Link to={routes.myProfile} className={styles.list_item}>Профиль</Link>
                <Link to={routes.createPost} className={styles.list_item}>Написать статью</Link>
                <div className={styles.list_item} onClick={logout}>Выход из аккаунта</div>
            </div>
        </div>
    );
};

export default BurgerMenu;
