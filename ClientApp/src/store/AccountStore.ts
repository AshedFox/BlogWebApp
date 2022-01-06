import {makeAutoObservable, reaction, runInAction} from "mobx";
import usersService from "../services/usersService";
import {LoginDto} from "../DTOs/LoginDto";
import {SignUpDto} from "../DTOs/SignUpDto";
import {AccountModel} from "../models/AccountModel";
import {createContext, useContext} from "react";

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
    
    private isRefreshingToken = false;
    account?: AccountModel;
    status: AccountStoreStatus = AccountStoreStatus.None;
    
    checkAuth = async () => {
        let result = false;
        
        if (this.account) {
            await this.refreshTokenIfNeeded();
            
            if (this.account && this.account.accessTokenExpiredAt) {
                result = new Date(this.account.accessTokenExpiredAt).valueOf() >= Date.now();
            }
        }
        
        return result;
    }
    
    refreshTokenIfNeeded = async () => {
        if (this.account && this.account.accessTokenExpiredAt) {
            if (new Date(this.account.accessTokenExpiredAt).valueOf() <= Date.now() + 60 * 1000) {
                if (!this.isRefreshingToken) {
                    runInAction(() => {
                        this.isRefreshingToken = true;
                        this.refreshToken().then(() => {
                            this.isRefreshingToken = false;
                        });
                    });
                }
            }
        }
    }

    private setAccount = (account: AccountModel) => {
        this.account = account;
    }
    
    login = async (loginData: LoginDto) => {
        runInAction(() => this.status = AccountStoreStatus.LoginLoading);

        return await usersService.login(loginData).then(
            (response) => {
                if (response.status === 200) {
                    return response.json().then(
                        (account: AccountModel) => {
                            try {
                                this.loginSuccess(account);
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
    private loginSuccess = (account: AccountModel) => {
        this.setAccount(account);

        this.status = AccountStoreStatus.LoginSuccess;
    }
    private loginError = () => this.status = AccountStoreStatus.LoginError;
    

    signUp = async (signUpData: SignUpDto) => {
        runInAction(() => this.status = AccountStoreStatus.SignUpLoading);

        return await usersService.signUp(signUpData).then(
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
    private signUpSuccess = () => this.status = AccountStoreStatus.SignUpSuccess;
    private signUpError = () => this.status = AccountStoreStatus.SignUpError;
    

    logout = () => {
        if (this.account) {
            usersService.logout();
            this.account = undefined;
        }
    }
    
    refreshToken = async () => {
        if (this.account) {
            return await usersService.refreshToken().then(
                (response) => {
                    if (response.status === 200) {
                        response.json().then(
                            (account: AccountModel) => {
                                this.setAccount(account);
                            },
                            () => this.logout()
                        )
                    }
                    else {
                        this.logout();
                    }
                }
            )
        }
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