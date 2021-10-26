import React, {SyntheticEvent, useState} from 'react';
import styles from "./SignUpPage.module.css";
import CryptoJS from "crypto-js";
import {routes} from "../../constants/routes";
import {SignUpDto} from "../../DTOs/SignUpDto";
import AccountStore, {AccountStoreStatus} from "../../store/AccountStore";
import {observer} from "mobx-react";

const SignUpPage = observer(() => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const [name, setName] = useState("");
    const {signUp, status} = AccountStore;

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
        return <div>LOADING...</div>
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
                                   placeholder={"Email"}
                                   onChange={e => setEmail(e.target.value)}
                            />
                            <input className={styles.input} name={"password"}
                                   type={"password"} value={password}
                                   placeholder={"Пароль"}
                                   onChange={e => setPassword(e.target.value)}
                            />
                            <input className={styles.input} name={"passwordRepeat"}
                                   type={"password"} value={passwordRepeat}
                                   placeholder={"Пароль (повторно)"}
                                   onChange={e => setPasswordRepeat(e.target.value)}
                            />
                            <input className={styles.input} name={"name"}
                                   type={"text"} value={name}
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
