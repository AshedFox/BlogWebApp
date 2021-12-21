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
    
    private isRefreshingToken = false;
    account?: AccountModel;
    status: AccountStoreStatus = AccountStoreStatus.None;
    
    checkAuth = async () => {
        let result = false;
        
        if (this.account) {
            await this.refreshTokenIfNeeded();
            
            if (this.account) {
                try {
                    const jwt = jwtDecode<JwtPayload>(this.account.accessToken);

                    if (jwt.exp) {
                        result = jwt.exp * 1000 > Date.now();
                    } else {
                        this.logout();
                    }
                } catch (InvalidTokenError) {}
            }
        }
        
        return result;
    }
    
    refreshTokenIfNeeded = async () => {
        if (this.account && !this.isRefreshingToken) {
            const jwt = jwtDecode<JwtPayload>(this.account.accessToken);

            if (jwt.exp) {
                if (jwt.exp * 1000 <= Date.now() - 60 * 1000) {
                    this.isRefreshingToken = true;
                    await this.refreshToken();
                    this.isRefreshingToken = false;
                }
            }
        }
    }

    private setAccount = (tokens: TokensDto) => {
        let userId = ""

        try {
            const jwt = jwtDecode<JwtPayload>(tokens.accessToken);

            if (jwt.sub) {
                userId = jwt.sub;
            }
        }
        catch (InvalidTokenError) {
            throw new Error();
        }

        this.account = {
            userId: userId,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        };
    }
    
    login = async (loginData: LoginDto) => {
        this.status = AccountStoreStatus.LoginLoading;

        return await usersService.login(loginData).then(
            (response) => {
                if (response.status === 200) {
                    return response.json().then(
                        (tokens: TokensDto) => {
                            try {
                                this.loginSuccess(tokens);
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
    private loginSuccess = (tokens: TokensDto) => {
        this.setAccount(tokens)

        this.status = AccountStoreStatus.LoginSuccess;
    }
    private loginError = () => this.status = AccountStoreStatus.LoginError;
    

    signUp = async (signUpData: SignUpDto) => {
        this.status = AccountStoreStatus.SignUpLoading;

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
        this.account = undefined;
    }
    
    refreshToken = async () => {
        if (this.account) {
            await usersService.refreshToken(this.account.refreshToken).then(
                async (response) => {
                    if (response.status === 200) {
                        await response.json().then(
                            (tokens: TokensDto) => {
                                this.setAccount(tokens);
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