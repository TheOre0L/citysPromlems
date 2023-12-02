import {$api} from "../http";
import {AxiosResponse} from "axios"
import {UserDTO} from "../models/response/UserDTO";
export default class UserServices {
    static async fetchUser(id: number): Promise<AxiosResponse>{
        return $api.get(`api/user/${id}`)
    }
    static async isActivatedUser(id: number): Promise<AxiosResponse>{
        return $api.get(`api/user/${id}`)
    }
}