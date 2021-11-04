import React, {SyntheticEvent, useState} from 'react';
import styles from "./SignUpPage.module.css";
import CryptoJS from "crypto-js";
import {routes} from "../../constants/routes";
import {SignUpDto} from "../../DTOs/SignUpDto";
import {AccountStoreStatus, useAccountStore} from "../../store/AccountStore";
import {observer} from "mobx-react";
import Loader from "../Loader/Loader";

const SignUpPage = observer(() => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const [name, setName] = useState("");
    const {signUp, status} = useAccountStore();

    const submitForm = async (e:SyntheticEvent) => {
        e.preventDefault();

        let signUpData:SignUpDto = {
            email: email,
            passwordHash: CryptoJS.SHA512(password).toString(CryptoJS.enc.Hex),
            name: name,
        }

        if (password === passwordRepeat){
            await signUp(signUpData);
        }
        else {
            alert("Значения в полях пароля не совпадают")
        }
    }

    if (status === AccountStoreStatus.Loading) {
        return <Loader/>
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.content}>
                    <form className={styles.form}
                          onSubmit={(e:SyntheticEvent)=>submitForm(e)}
                    >
                        <legend className={styles.title}>{"Регистрация"}</legend>
                        <fieldset className={styles.fields}>
                            <input className={styles.input} name={"email"}
                                   type={"email"} value={email}
                                   placeholder={"Email"} maxLength={320}
                                   onChange={e => setEmail(e.target.value)}
                            />
                            <input className={styles.input} name={"password"}
                                   type={"password"} value={password}
                                   placeholder={"Пароль"} maxLength={64}
                                   onChange={e => setPassword(e.target.value)}
                            />
                            <input className={styles.input} name={"passwordRepeat"}
                                   type={"password"} value={passwordRepeat}
                                   placeholder={"Пароль (повторно)"} maxLength={64}
                                   onChange={e => setPasswordRepeat(e.target.value)}
                            />
                            <input className={styles.input} name={"name"}
                                   type={"text"} value={name} maxLength={100}
                                   placeholder={"Имя пользователя"}
                                   onChange={e => setName(e.target.value)}
                            />
                        </fieldset>
                        {
                            status === AccountStoreStatus.Error &&
                            <div className={styles.error}>Возникла ошибка при попытке регистрации</div>
                        }
                        <div className={styles.submit_block}>
                            <a className={styles.link} href={routes.login}>
                                {"Уже есть аккаунт?"}
                            </a>
                            <button className={styles.button} type={"submit"}>
                                {"Зарегистрироваться"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
});

export default SignUpPage;
