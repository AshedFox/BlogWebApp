import {makeAutoObservable, runInAction} from "mobx";
import {UserModel} from "../models/UserModel";
import usersService from "../services/usersService";
import {AccountStore} from "./AccountStore";
import {createContext, useContext} from "react";

export enum UsersStoreStatus {
    None = "None",
    GetUsersLoading = "GetUsersLoading",
    GetUsersSuccess = "GetUsersSuccess",
    GetUsersError = "GetUsersError",
    GetUserLoading = "GetUserLoading",
    GetUserSuccess = "GetUserSuccess",
    GetUserError = "GetUserError",
}

class Users {
    constructor() {
        makeAutoObservable(this)
    }
    
    currentUser?: UserModel;
    status: UsersStoreStatus = UsersStoreStatus.None;
    
    getUsers = async () => {
        runInAction(() => this.status = UsersStoreStatus.GetUsersLoading);
        
        await AccountStore.refreshTokenIfNeeded();

        return await usersService.getUsers().then(
            (response) => {
                if (response.status === 200) {
                    return response.json().then(
                        (users: UserModel[]) => {
                            this.getUsersSuccess();
                            return users;
                        },
                        () => {
                            this.getUsersError();
                            return null;
                        }
                    )
                } else {
                    this.getUsersError();
                    if (response.status === 401) {
                        AccountStore.logout();
                    }
                    return null;
                }
            },
            () => {
                this.getUsersError();
                return null;
            }
        )
    }
    private getUsersSuccess = () => this.status = UsersStoreStatus.GetUsersSuccess;
    private getUsersError = () => this.status = UsersStoreStatus.GetUsersError;
    
    getUser = async (id: string) => {
        runInAction(() => this.status = UsersStoreStatus.GetUserLoading);
        
        await AccountStore.refreshTokenIfNeeded();
        
        return await usersService.getUser(id).then(
            (response) => {
                if (response.status === 200) {
                    return response.json().then(
                        (user: UserModel) => {
                            this.getUserSuccess(user);
                            return user;
                        },
                        () => {
                            this.getUserError();
                            return null;
                        }
                    )
                }
                else {
                    this.getUserError();
                    if (response.status === 401) {
                        AccountStore.logout();
                    }
                    return null;
                }
            },
            () => {
                this.getUserError();
                return null;
            }
        )
    }
    private getUserSuccess = (user: UserModel) => {
        this.currentUser = user;
        this.status = UsersStoreStatus.GetUserSuccess;
    }
    private getUserError = () => this.status = UsersStoreStatus.GetUserError;
}

export const UsersStore = new Users();

const UsersStoreContext = createContext(UsersStore);

export const useUsersStore = () => {
    return useContext(UsersStoreContext);
}