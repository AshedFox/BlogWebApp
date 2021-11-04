import {AccountStore} from "../store/AccountStore";

export const makeAuthHeader = () => {
    const authJWT = AccountStore.getAuthJWT();
    return authJWT ? {
        Authorization: `Bearer ${authJWT}`
    } : undefined;
}