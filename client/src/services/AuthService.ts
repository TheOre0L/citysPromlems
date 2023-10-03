import {$api} from "../http";
import {AxiosResponse} from "axios"
import {AuthResponse} from "../models/response/AuthResponse";
export default class AuthService {
    static async login(login: string, password: string): Promise<AxiosResponse<AuthResponse>>{
       return $api.post<AuthResponse>("api/login", {login, password})
    }
    static async registration(login: string, password:string, name:string, surname:string, email:string, city:string): Promise<AxiosResponse<AuthResponse>>{
        return $api.post<AuthResponse>("api/registration", {login, password, name, surname, email, city})
    }
}