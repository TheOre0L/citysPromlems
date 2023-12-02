import {$api} from "../http";
import {AxiosResponse} from "axios"
import {PostResponse} from "../models/response/PostResponse";
export default class PostService {
    static async create(title: string, context:string,
                        author_id:number, city_post:string, image_url:string,): Promise<AxiosResponse<PostResponse>>{
        return await $api.post<PostResponse>("post/create", {
            title,
            context,
            author_id,
            city_post,
            image_url,
        })
    }
    static async getPost(id: number): Promise<AxiosResponse>{
        return $api.get(`post/${id}`)
    }
    static async deletePost(id: number): Promise<AxiosResponse>{
        return $api.delete(`post/delete/${id}`)
    }
    static async getAllPosts(): Promise<any> {
        return $api.get('post/allposts')
    }
}