import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import ITeacher from '../models/Teacher';
import IActivity from '../models/Activity';

const API_URL = `http://localhost:80/api`;

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
})

$api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const keyFromStorage = localStorage.getItem('teacherCode');

    if (keyFromStorage) {
        config.params = { ...config.params, code: keyFromStorage }; // Добавляем параметр code
    }

    return config;
}, (error) => {
    return Promise.reject(error); // Обработка ошибок
});

export default class Server {
    static verifyTeacher(
        email: string,
        password: string
    ): Promise<AxiosResponse<ITeacher>> {
        return $api.get<ITeacher>(
            '/verify-teacher',
            {
                params: {
                    email, password
                }
            }
        )
    }

    static getActivitiesForTeacherWithoutThemes(
        teacherId: string
    ): Promise<AxiosResponse<IActivity[]>> {
        return $api.get<IActivity[]>(
            '/get-activities-for-teacher-without-themes',
            {
                params: {
                    teacherId
                }
            }
        )
    }
}