import {UserDTO} from "../models/response/UserDTO";
import {makeAutoObservable, runInAction, toJS} from "mobx";
import AuthService from "../services/AuthService";
import axios from 'axios';
import {AuthResponse} from "../models/response/AuthResponse";
import {API_URL} from "../http";
import UserServices from "../services/UserServices";
import {PostDto} from "../models/response/PostDto";
import PostService from "../services/PostService";
import {number} from "joi";

export default class Store {

    public user = {} as UserDTO;
    public userR= {} as UserDTO;
    public post = {} as PostDto;
    public getpost = {} as PostDto;
    public author = {} as UserDTO
    public allPosts:any = [];
    public error: string = "";
    public is_error = false;
    public isAuth = false;
    public isLoading = false;
    constructor() {
        makeAutoObservable(this);

    }
    setNewPost(newpost: any){
        this.post = newpost;
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
    async setUser(user: UserDTO) {
        this.user = await user;
        localStorage.setItem("userId", String(this.user.id));
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
    async login(login: string, password:string){
        try {
            await AuthService.login(login, password)
                .then(response => {
                    localStorage.setItem('token', response.data.accessToken)
                    this.setAuth(true);
                    this.setUser(response.data.user)
                    window.location.replace("/")
                })
            //console.log(response)
        } catch (e: any) {
            console.error(e.response.data.message);
            this.setError(e.response.data.message, true);
            //window.location.replace("/login")
        }

    }
    async registration(login: string, password:string, name:string, surname:string, email:string, city:string){
        try {
            const response = await AuthService.registration(login, password, name, surname, email, city);
            localStorage.setItem('token', response.data.accessToken);
            //localStorage.setItem("userid", `${response.data.user.id}`);
            this.setAuth(true);
            this.setUser(response.data.user)
            window.location.replace("/login")
        } catch (e: any) {
            console.error(e.response.data.message);
            this.setError(e.response.data.message, true);
        }

    }
    async getUser(id: number){
        try {
            const response = await UserServices.fetchUser(id);
            runInAction(() => {
                this.setNoMySelf(toJS(response.data.user));
            })


        } catch (e: any) {
            console.error(e.response.data.message);
            this.setError(e.response.data.message, true);
        }

    }
    async logout() {
        try {
            const response = await AuthService.logout();
            await localStorage.removeItem('token');
            await this.setAuth(false);
            await this.setUser({} as UserDTO);
            window.location.replace("/")
        } catch (e: any) {
            console.error(e.response.data.message);
            this.setError(e.response.data.message, true);
        }
    }

    async checkAuth() {
        this.setLoading(true);
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/api/refresh`, {withCredentials: true})
            console.log(response);
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e: any) {
            console.error(e.response.data.message);
            this.setError(e.response.data.message, true);
        } finally {
            this.setLoading(false);
        }
    }
    async createPost(title: string, context:string, author_id:number, city_post:string, image_url:string, tags: string){
        try {
            const response = await PostService.create(
                title,
                context,
                author_id,
                city_post,
                image_url,
                tags
            );
            this.setNewPost(response.data.post);
            window.location.replace('/posts')
        } catch (e: any) {
            console.error(e.response.data.message);
            this.setError(e.response.data.message, true);
        }
    }
    async deletePost(id:number){
        try {
            const response = await PostService.deletePost(id);
            window.location.replace('/posts')
        } catch (e: any) {
            if (e) {
                console.error(e.response.data.message);
                this.setError(e.response.data.message, true);
            }
        }
    }
    async getAllPosts(){
        this.setLoading(true);
        try {
            const response = await PostService.getAllPosts().then((res) => {
                this.setAllPost(res.data);
            })
        } catch (e: any) {
            if(e){
                console.error(e.response.data.message);
                this.setError(e.response.data.message, true);
            }
        } finally {
            this.setLoading(false);
        }
    }
    async getPost(id: number){
        this.setLoading(true);
        try {
            const response = await PostService.getPost(id);
            runInAction(() => {
                this.setPost(toJS(response.data.post), toJS(response.data.author));
            })
        } catch (e: any) {
            console.error(e.response.data.message);
            this.setError(e.response.data.message, true);
        }
        finally {
            this.setLoading(false);
        }
    }
}