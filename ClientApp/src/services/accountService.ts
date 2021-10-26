import {SignUpDto} from "../DTOs/SignUpDto";
import {LoginDto} from "../DTOs/LoginDto";

const apiUrl = window.location.origin + "/api/account";

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

const logout = async () => {
    const options:RequestInit = {
        method: "GET",
    }
    const request = new Request(apiUrl + "/logout", options);

    return await fetch(request);
}

const accountsService = {
    signUp,
    login,
    logout
}

export default accountsService;
