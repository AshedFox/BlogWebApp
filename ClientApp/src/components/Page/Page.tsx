import React, {FC} from 'react';
import Header from "./Header/Header";
import styles from "./Page.module.css";
import AuthModal from "../AuthModal/AuthModal";

const Page:FC = ({children}) => {
    return (
        <div>
            <AuthModal/>
            <Header/>
            <div className={styles.container}>{children}</div>
        </div>
    );
};

export default Page;
