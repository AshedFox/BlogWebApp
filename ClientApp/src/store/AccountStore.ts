import {autorun, makeAutoObservable, reaction, runInAction} from "mobx";
import {LoginResultDto} from "../DTOs/LoginResultDto";
import accountService from "../services/accountService";
import {LoginDto} from "../DTOs/LoginDto";
import {SignUpDto} from "../DTOs/SignUpDto";
import {AccountModel} from "../models/AccountModel";

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

    login = async (loginData: LoginDto) => {
        try {
            runInAction(() => this.status = AccountStoreStatus.Loading);

            const response = await accountService.login(loginData);

            if (response.status === 200) {
                const loginResult: LoginResultDto = await response.json();

                runInAction(() => {
                    this.account = {
                        user: loginResult.user,
                        authToken: loginResult.authToken,
                        tokenValidTo: loginResult.tokenValidTo
                    }

                    this.status = AccountStoreStatus.Success;
                });
            } else {
                runInAction(() => this.status = AccountStoreStatus.Error);
            }
        } catch (e) {
            runInAction(() => this.status = AccountStoreStatus.Error);
        }
    }

    signUp = async (signUpData: SignUpDto) => {
        try {
            runInAction(() => this.status = AccountStoreStatus.Loading);

            const response = await accountService.signUp(signUpData);

            if (response.status === 201) {
                runInAction(() => this.status = AccountStoreStatus.Success);
            } else {
                runInAction(() => this.status = AccountStoreStatus.Error);
            }
        } catch (e) {
            runInAction(() => this.status = AccountStoreStatus.Error);
        }
    }

    logout = async () => {
        try {
            runInAction(() => this.status = AccountStoreStatus.Loading);

            const response = await accountService.logout();

            if (response.status === 200) {
                runInAction(() => {
                    this.account = undefined;
                    this.status = AccountStoreStatus.Success
                });
            } else {
                runInAction(() => this.status = AccountStoreStatus.Error);
            }
        } catch (e) {
            runInAction(() => this.status = AccountStoreStatus.Error);
        }
    }
}

const AccountStore = new Account();

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

export default AccountStore;
