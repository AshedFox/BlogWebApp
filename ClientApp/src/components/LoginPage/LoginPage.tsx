import React, {SyntheticEvent, useState} from 'react';
import styles from "./LoginPage.module.css";
import CryptoJS from "crypto-js";
import {routes} from "../../constants/routes";
import {LoginDto} from "../../DTOs/LoginDto";
import {observer} from "mobx-react";
import Loader from "../Loader/Loader";
import {AccountStoreStatus, useAccountStore} from "../../store/AccountStore";

const LoginPage = observer(() => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const {login, status} = useAccountStore();

    const submitForm = async (e:SyntheticEvent) => {
        e.preventDefault();

        let loginData:LoginDto = {
            email: email,
            passwordHash: CryptoJS.SHA512(password).toString(CryptoJS.enc.Hex),
        }

        login(loginData);
    }

    if (status === AccountStoreStatus.LoginLoading) {
        return <Loader/>
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.content}>
                    <form className={styles.form}
                          onSubmit={(e:SyntheticEvent)=>submitForm(e)}
                    >
                        <legend className={styles.title}>{"Авторизация"}</legend>
                        <div className={styles.fields}>
                            <input className={styles.input} value={email}
                                   name={"email"} type={"text"}
                                   placeholder={"Email"} maxLength={320}
                                   onChange={e => setEmail(e.target.value)}
                            />
                            <input className={styles.input} value={password}
                                   name={"password"} type={"password"} maxLength={64}
                                   placeholder={"Пароль"} autoComplete={"currentPassword"}
                                   onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                        {
                            status === AccountStoreStatus.LoginError &&
                                <div className={styles.error}>Возникла ошибка при попытке авторизации</div>
                        }
                        <div className={styles.submit_block}>
                            <a className={styles.link} href={routes.signUp}>
                                {"Нет аккаунта?"}
                            </a>
                            <button className={styles.button} type={"submit"}>
                                {"Войти"}
                            </button>
                        </div>
                    </form>
                    <div className={styles.separator}>
                        <div className={styles.line}/>
                        <div className={styles.text}>{"Или войдите с помощью"}</div>
                        <div className={styles.line}/>
                    </div>
                    <div className={styles.additional_auth}>
                        <div className={ `${styles.button} ${styles.vk_button}`}>{"Вконтакте"}</div>
                        <div className={`${styles.button} ${styles.google_button}`}>{"Google"}</div>
                    </div>
                </div>
            </div>
        </>
    );
});

export default LoginPage;
