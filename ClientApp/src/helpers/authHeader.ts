import {AccountStore} from "../store/AccountStore";

export const makeAuthHeader = () => {
    const authJWT = AccountStore.account?.accessToken;
    return authJWT ? {
        Authorization: `Bearer ${authJWT}`
    } : undefined;
}