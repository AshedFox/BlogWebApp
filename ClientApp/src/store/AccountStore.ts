import {makeAutoObservable, reaction} from "mobx";
import {TokensDto} from "../DTOs/TokensDto";
import usersService from "../services/usersService";
import {LoginDto} from "../DTOs/LoginDto";
import {SignUpDto} from "../DTOs/SignUpDto";
import {AccountModel} from "../models/AccountModel";
import {createContext, useContext} from "react";
import jwtDecode, {JwtPayload} from "jwt-decode";

export enum AccountStoreStatus {
    None = "None",
    LoginLoading = "LoginLoading",
    LoginSuccess = "LoginSuccess",
    LoginError = "LoginError",
    SignUpLoading = "SignUpLoading",
    SignUpSuccess = "SignUpSuccess",
    SignUpError = "SignUpError"
}

class Account {
    constructor() {
        makeAutoObservable(this);
        
        const account = localStorage.getItem("account");
        
        if (account) {
            this.account = JSON.parse(account) as AccountModel;
        }
    }

    account?: AccountModel;
    status: AccountStoreStatus = AccountStoreStatus.None;
    
    
    checkAuth = () => {
        if (this.account) {
            try {
                const jwt = jwtDecode<JwtPayload>(this.account.accessToken);
                
                if (jwt.exp) {
                    if (jwt.exp * 1000 > Date.now()) {
                        return true;
                    }
                    else {
                        this.logout();
                        return false;
                    }
                }
                else {
                    return false
                }
            }
            catch (InvalidTokenError) {
                return false;
            }
        }
        else {
            return false;
        }
    }
    
    login = (loginData: LoginDto) => {
        this.status = AccountStoreStatus.LoginLoading;

        return usersService.login(loginData).then(
            (response) => {
                if (response.status === 200) {
                    return response.json().then(
                        (loginResult: TokensDto) => {
                            try {
                                this.loginSuccess(loginResult);
                                return true;
                            } catch {
                                return false;
                            }
                        },
                        () => {
                            this.loginError()
                            return false;
                        }
                    )
                }
                else {
                    this.loginError();
                    return false;
                }
            },
            () => {
                this.loginError()
                return false;
            }
        );
    }

    loginSuccess = (loginResult: TokensDto) => {
        let userId = ""
        
        try {
            const jwt = jwtDecode<JwtPayload>(loginResult.accessToken);
            
            console.log(jwt)
            if (jwt.sub) {
                userId = jwt.sub;
            }
        }
        catch (InvalidTokenError) {
            throw new Error();
        }

        this.account = {
            userId: userId,
            accessToken: loginResult.accessToken,
            refreshToken: loginResult.refreshToken
        };
        
        this.status = AccountStoreStatus.LoginSuccess;
    }
    loginError = () => this.status = AccountStoreStatus.LoginError;
    
    signUp = (signUpData: SignUpDto) => {
        this.status = AccountStoreStatus.SignUpLoading;

        return usersService.signUp(signUpData).then(
            (response) => {
                if (response.status === 201) {
                    this.signUpSuccess();
                    return true;
                }
                else {
                    this.signUpError();
                    return false;
                }
            },
            () => {
                this.signUpError();
                return false;
            }
        )
    }

    signUpSuccess = () => this.status = AccountStoreStatus.SignUpSuccess;
    signUpError = () => this.status = AccountStoreStatus.SignUpError;

    logout = () => {
        this.account = undefined;
    }
}

export const AccountStore = new Account();

const AccountStoreContext = createContext(AccountStore);

export const useAccountStore = () => {
    return useContext(AccountStoreContext);
}

reaction(
    () => AccountStore.account,
    account => {
        if (account) {
            localStorage.setItem("account", JSON.stringify(account));
        } else {
            localStorage.removeItem("account");
        }
    }
)