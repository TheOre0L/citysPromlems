import {UserDTO} from "../models/response/UserDTO";
import {makeAutoObservable} from "mobx";
import AuthService from "../services/AuthService";

export default class Store {
    user = {} as UserDTO;
    isAuth = false;

    constructor() {
        makeAutoObservable(this);
    }
    setAuth(bool: boolean) {
        this.isAuth = bool;
    }
    setUser(user: UserDTO) {
        this.user = user;
    }
    async login(login: string, password:string){
        try {
            const response = await AuthService.login(login, password);
            console.log(response)
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user)
        } catch (e) {
            console.log(e);
        }

    }
    async registration(login: string, password:string, name:string, surname:string, email:string, city:string){
        try {
            const response = await AuthService.registration(login, password, name, surname, email, city);
            console.log(response)
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user)
        } catch (e) {
            console.log(e);
        }

    }
}