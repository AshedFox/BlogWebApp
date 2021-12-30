import React, {SyntheticEvent, useState} from 'react';
import styles from "./AuthModal.module.css";
import CryptoJS from "crypto-js";
import {LoginDto} from "../../DTOs/LoginDto";
import {observer} from "mobx-react";
import Loader from "../Loader/Loader";
import {AccountStoreStatus, useAccountStore} from "../../store/AccountStore";
import {SignUpDto} from "../../DTOs/SignUpDto";
import {AuthModalStatus, useAuthModalStore} from "../../store/AuthModalStore";

enum AuthType {
    Login,
    SignUp
}

const AuthModal = observer(() => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const [name, setName] = useState("");
    const [currentType, setCurrentType] = useState<AuthType>(AuthType.Login);
    
    const {login, signUp, status} = useAccountStore();
    const {setStatus, status: modalsStatus} = useAuthModalStore();

    const submitLoginForm = async (e:SyntheticEvent) => {
        e.preventDefault();

        let loginData:LoginDto = {
            email: email,
            passwordHash: CryptoJS.SHA512(password).toString(CryptoJS.enc.Hex),
        }

        login(loginData).then(()=>{
            setStatus(AuthModalStatus.Closing)
        })
    }

    const submitSignUpForm = async (e:SyntheticEvent) => {
        e.preventDefault();

        let signUpData:SignUpDto = {
            email: email,
            passwordHash: CryptoJS.SHA512(password).toString(CryptoJS.enc.Hex),
            name: name,
        }

        if (password === passwordRepeat) {
            signUp(signUpData).then(
                () => {
                    setEmail("");
                    setPassword("");
                    setPasswordRepeat("");
                    setName("");
                }
            );
        }
        else {
            alert("Значения в полях пароля не совпадают")
        }
    }
    
    if (modalsStatus === AuthModalStatus.Closed) {
        return null;
    }
    
    return (
        <div className={`${styles.container} ${modalsStatus === AuthModalStatus.Closing ? styles.closing : ""}`} 
             onClick={() => setStatus(AuthModalStatus.Closing)}
        >
            <div className={`${styles.content} ${modalsStatus === AuthModalStatus.Closing ? styles.closing : ""}`}
                 onAnimationEnd={() => {
                     if (modalsStatus === AuthModalStatus.Closing) {
                         setStatus(AuthModalStatus.Closed)
                     }
                 }}
                 onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.header}>
                    <div className={styles.switch}>
                        <div className={`${styles.title} ${currentType === AuthType.Login ? styles.selected : ""}`} 
                             onClick={() => setCurrentType(AuthType.Login)}>Авторизация</div>
                        <div className={`${styles.title} ${currentType === AuthType.SignUp ? styles.selected : ""}`} 
                             onClick={() => setCurrentType(AuthType.SignUp)}>Регистрация</div>
                    </div>
                    <div className={styles.close} onClick={() => setStatus(AuthModalStatus.Closing)}>✖</div>
                </div>
                {(status === AccountStoreStatus.LoginLoading || status === AccountStoreStatus.SignUpLoading) &&
                    <div className={styles.overlay}>
                        <Loader/>
                    </div>
                }
                {
                    currentType === AuthType.Login ?
                        <form className={styles.form} onSubmit={(e: SyntheticEvent) => submitLoginForm(e)}>
                            <div className={styles.fields}>
                                <input className={styles.input} value={email}
                                       name={"email"} type={"text"} required
                                       placeholder={"Email"} maxLength={320} minLength={5}
                                       onChange={e => setEmail(e.target.value)}
                                />
                                <input className={styles.input} value={password} required
                                       name={"password"} type={"password"} maxLength={64} minLength={4}
                                       placeholder={"Пароль"} autoComplete={"currentPassword"}
                                       onChange={e => setPassword(e.target.value)}
                                />
                            </div>
                            {
                                status === AccountStoreStatus.LoginError &&
                                <div className={styles.error}>Возникла ошибка при попытке авторизации</div>
                            }
                            <button className={styles.button} type={"submit"}>Войти</button>
                        </form> :
                        <form className={styles.form} onSubmit={(e) => submitSignUpForm(e)}>
                            <div className={styles.fields}>
                                <input className={styles.input} name={"email"}
                                       type={"email"} value={email} required
                                       placeholder={"Email"} maxLength={320} minLength={5}
                                       onChange={e => setEmail(e.target.value)}
                                />
                                <input className={styles.input} name={"password"}
                                       type={"password"} value={password} required
                                       placeholder={"Пароль"} maxLength={64} minLength={4}
                                       onChange={e => setPassword(e.target.value)}
                                />
                                <input className={styles.input} name={"passwordRepeat"}
                                       type={"password"} value={passwordRepeat} required
                                       placeholder={"Пароль (повторно)"} maxLength={64} minLength={4}
                                       onChange={e => setPasswordRepeat(e.target.value)}
                                />
                                <input className={styles.input} name={"name"}
                                       type={"text"} value={name} maxLength={100} required
                                       placeholder={"Имя пользователя"}
                                       onChange={e => setName(e.target.value)}
                                />
                            </div>
                            {
                                status === AccountStoreStatus.SignUpError &&
                                <div className={styles.error}>Возникла ошибка при попытке регистрации</div>
                            }
                            {
                                status === AccountStoreStatus.SignUpSuccess &&
                                <div className={styles.success}>Регистрация прошла успешно</div>
                            }
                            <button className={styles.button} type={"submit"}>Зарегистрироваться</button>
                        </form>
                }
            </div>
        </div>
    );
});

export default AuthModal;
