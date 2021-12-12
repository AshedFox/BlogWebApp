import {SignUpDto} from "../DTOs/SignUpDto";
import {LoginDto} from "../DTOs/LoginDto";

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

const refreshToken = async (refreshToken: string) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const options:RequestInit = {
        method: "POST",
        headers,
        body: refreshToken
    }
    const request = new Request(apiUrl + "/refreshToken", options);

    return await fetch(request);
}

const usersService = {
    signUp,
    login,
    refreshToken
}

export default usersService;
