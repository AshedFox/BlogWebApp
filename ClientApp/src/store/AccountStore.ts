import {makeAutoObservable, reaction} from "mobx";
import {LoginResultDto} from "../DTOs/LoginResultDto";
import accountService from "../services/accountService";
import {LoginDto} from "../DTOs/LoginDto";
import {SignUpDto} from "../DTOs/SignUpDto";
import {AccountModel} from "../models/AccountModel";
import {createContext, useContext} from "react";

export enum AccountStoreStatus {
    None = "None",
    Loading = "Loading",
    Success = "Success",
    Error = "Error"
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
    
    getAuthJWT = () => {
        return this.account?.authToken;
    }
    
    login = (loginData: LoginDto) => {
        this.status = AccountStoreStatus.Loading;

        accountService.login(loginData).then(
            (response) => {
                if (response.status === 200) {
                    response.json().then(
                        (loginResult: LoginResultDto) => this.loginSuccess(loginResult),
                        () => this.loginError()
                    )
                }
                else {
                    this.loginError();
                }
            },
            () => this.loginError()
        )
    }

    loginSuccess = (loginResult: LoginResultDto) =>  {
        this.account = {
            user: loginResult.user,
            authToken: loginResult.authToken,
            tokenValidTo: loginResult.tokenValidTo
        };
        this.status = AccountStoreStatus.Success;
    }
    loginError = () => this.status = AccountStoreStatus.Error;
    
    signUp = (signUpData: SignUpDto) => {
        this.status = AccountStoreStatus.Loading;

        accountService.signUp(signUpData).then(
            (response) => {
                if (response.status === 201) {
                    this.signUpSuccess()
                }
                else {
                    this.signUpError();
                }
            },
            () => this.signUpError()
        )
    }

    signUpSuccess = () => this.status = AccountStoreStatus.Success;
    signUpError = () => this.status = AccountStoreStatus.Error;
    
    logout = () => {
        this.status = AccountStoreStatus.Loading;

        accountService.logout().then(
            (response) => {
                if (response.status === 200) {
                    this.logoutSuccess();
                } 
                else {
                    this.logoutError();
                }
            },
            () => this.logoutError()
        );
    }

    logoutSuccess = () => {
        this.account = undefined;
        this.status = AccountStoreStatus.Success
    }
    logoutError = () => this.status = AccountStoreStatus.Error;
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
        }
        else {
            localStorage.removeItem("account");
        }
    }
)