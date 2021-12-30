import {makeAutoObservable} from "mobx";
import {createContext, useContext} from "react";

export enum AuthModalStatus {
    Closed = "Closed",
    Closing = "Closing",
    Opened = "Opened",
}


class AuthModal {
    constructor() {
        makeAutoObservable(this);
    }
    
    status = AuthModalStatus.Closed;
    
    setStatus = (status: AuthModalStatus) => {
        this.status = status;
    }
}

export const AuthModalStore = new AuthModal();

const AuthModalStoreContext = createContext(AuthModalStore);

export const useAuthModalStore = () => {
    return useContext(AuthModalStoreContext);
}