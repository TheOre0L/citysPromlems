import {$api} from "../http";
import {AxiosResponse} from "axios"
import {UserDTO} from "../models/response/UserDTO";
export default class UserServices {
    static async login(login: string, password: string): Promise<AxiosResponse<UserDTO[]>>{
        return $api.get<UserDTO[]>("api/users")
    }
}