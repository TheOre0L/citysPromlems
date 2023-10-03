import {UserDTO} from "./UserDTO";

export interface AuthResponse{
    accessToken: string,
    refreshToken: string,
    user: UserDTO
}