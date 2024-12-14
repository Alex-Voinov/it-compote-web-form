import axios, { AxiosResponse } from 'axios';
import ITeacher from '../models/Teacher';

const API_URL = `http://localhost:80/api`;

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
})

export default class Server {
    static verifyTeacher(
        email: string,
        password: string
    ): Promise<AxiosResponse<ITeacher>> {
        return $api.get<ITeacher>(
            '/verify-teacher',
            {
                params:{
                    email, password
                }
            }
        )
    }
}