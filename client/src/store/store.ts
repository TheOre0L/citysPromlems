import axios from 'axios';
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { API_URL } from "../http";
import { AuthResponse } from "../models/response/AuthResponse";
import { PostDto } from "../models/response/PostDto";
import { UserDTO } from "../models/response/UserDTO";
import AuthService from "../services/AuthService";
import PostService from "../services/PostService";
import UserServices from "../services/UserServices";

export default class Store {

    public user = {} as UserDTO;
    public userR= {} as UserDTO;
    public post = {} as PostDto;
    public getpost = {} as PostDto;
    public author = {} as UserDTO
    public allPosts:any = [];
    public error: string = "";
    public is_error:boolean = false;
    public isAuth:boolean = false;
    public isActiv:boolean = false;
    public isLoading:boolean = false;
    public is_message:boolean = false;
    public message:string = "";
    public color_msg:string = "";
    constructor() {
        makeAutoObservable(this);

    }
    setNewPost(newpost: any){
        this.post = newpost;
    }
    setActivated(activated: boolean){
        this.isActiv = activated;
    }
    async setAllPost(allposts: any){
        this.allPosts = await allposts;
    }
    async setPost(post: any, author: any){
        this.getpost = await post;
        this.author = await author;
    }
    setAuth(bool: boolean) {
        this.isAuth = bool;
    }
    async setUser(userMe: UserDTO) {
        this.user = userMe;
    }
    setLoading(bool: boolean) {
        this.isLoading = bool;
    }
    setError(errors: string, isErr: boolean) {
        this.is_error = isErr;
        this.error = errors;
    }
    setNoMySelf(user: UserDTO) {
        this.userR = user
    }
    setMsg(isMsg: boolean, msg: string, color: string){
        this.is_message = isMsg;
        this.message = msg;
        this.color_msg = color;
    }
    async login(login: string, password:string){
        try {
            const response = await AuthService.login(login, password)
            localStorage.setItem('token', response.data.accessToken)
            localStorage.setItem("userId", `${response.data.user.id}`)
            await this.setUser(response.data.user)
            this.setAuth(true);
            this.setMsg(true, "Успешная авторизация!", "success")
        } catch (e: any) {
            console.error(e.response.data.message);
            this.setError(e.response.data.message, true);
        }
    }
    async registration(login: string, password:string, name:string, surname:string, email:string, city:string){
        try {
            const response = await AuthService.registration(login, password, name, surname, email, city);
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem("userId", `${response.data.user.id}`);
            this.setAuth(true);
            this.setUser(response.data.user)
            this.setMsg(true, "Успешная регистрация!", "success")
        } catch (e: any) {
            console.error(e.response.data.message);
            this.setError(e.response.data.message, true);
        }
    }
    async getUser(id: number){
        this.setLoading(true);
        try {
            const response = await UserServices.fetchUser(id);
            runInAction(() => {
                this.setNoMySelf(toJS(response.data.user));
            })


        } catch (e: any) {
            console.error(e.response.data.message);
            this.setError(e.response.data.message, true);
        }  finally {
            this.setLoading(false);
        }

    }
    async logout() {
        this.setLoading(true);
        try {
            const response = await AuthService.logout();
            await localStorage.removeItem('token');
            await localStorage.removeItem('userId');
            await this.setAuth(false);
            await this.setUser({} as UserDTO);
        } catch (e: any) {
            console.error(e.response.data.message);
            this.setError(e.response.data.message, true);
        }  finally {
            this.setLoading(false);
            window.location.replace("/")
        }
    }

    async checkAuth() {
        this.setLoading(true);
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/api/refresh`, {withCredentials: true})
            console.log(response);
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('userId', `${response.data.user.id}`);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e: any) {
            console.error(e.response.data.message);
            this.setError(e.response.data.message, true);
        } finally {
            this.setLoading(false);
        }
    }
    async createPost(title: string, context:string, author_id:number, city_post:string, image_url:string,){
        this.setLoading(true);
        try {
            const response = await PostService.create(
                title,
                context,
                author_id,
                city_post,
                image_url
            );
            this.setNewPost(response.data.post);
            this.setMsg(true, `Пост успешно создан, через 4 секунды вы будете перенаправленны на него!`, "success")
            setTimeout(() => {
                window.location.replace(`/post/${response.data.post.idpost}`)
            }, 4000)

        } catch (e: any) {
            console.error(e.response.data.message);
            this.setMsg(true, `${e.response.data.message}`, "error")
        }  finally {
            this.setLoading(false);

        }
    }
    async deletePost(id:number){
        this.setLoading(true);
        try {
            const response = await PostService.deletePost(id);
            window.location.replace('/posts')
        } catch (e: any) {
            if (e) {
                console.error(e.response.data.message);
                this.setError(e.response.data.message, true);
            }
        }  finally {
            this.setLoading(false);
        }
    }
}