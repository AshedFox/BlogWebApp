import {SignUpDto} from "../DTOs/SignUpDto";
import {LoginDto} from "../DTOs/LoginDto";
import {makeAuthHeader} from "../helpers/authHeader";

const apiUrl = window.location.origin + "/api/users";

const signUp = async (signUpData: SignUpDto) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const options:RequestInit = {
        method: "POST",
        headers,
        body: JSON.stringify(signUpData)
    }
    const request = new Request(apiUrl + "/signup", options);

    return await fetch(request);
}

const login = async (loginData: LoginDto) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const options:RequestInit = {
        method: "POST",
        headers,
        body: JSON.stringify(loginData)
    }
    const request = new Request(apiUrl + "/login", options);

    return await fetch(request);
}

const logout = async (refreshToken: string) => {
    const headers = new Headers(makeAuthHeader());
    headers.append("Content-Type", "application/json");
    const options:RequestInit = {
        method: "POST",
        headers,
        body: `"${refreshToken}"`
    }
    const request = new Request(apiUrl + "/logout", options);

    return await fetch(request);
}

const refreshToken = async (refreshToken: string) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const options:RequestInit = {
        method: "POST",
        headers,
        body: `"${refreshToken}"`
    }
    const request = new Request(apiUrl + "/refreshToken", options);

    return await fetch(request);
}

const getUsers = async () => {
    const options: RequestInit = {
        method: "GET",
        headers: makeAuthHeader()
    }

    const request = new Request(apiUrl, options);

    return await fetch(request);
}

const getUser = async (id: string) => {
    const options: RequestInit = {
        method: "GET",
        headers: makeAuthHeader()
    }

    const request = new Request(apiUrl + "/" + id, options);

    return await fetch(request);
}

const usersService = {
    signUp,
    login,
    logout,
    refreshToken,
    getUsers,
    getUser
}

export default usersService;
