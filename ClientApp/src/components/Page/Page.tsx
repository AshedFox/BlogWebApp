import React, {FC} from 'react';
import Header from "./Header/Header";
import styles from "./Page.module.css";

const Page:FC = ({children}) => {
    return (
        <div>
            <Header/>
            <div className={styles.container}>{children}</div>
        </div>
    );
};

export default Page;
