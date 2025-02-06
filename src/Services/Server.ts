import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import ITeacher from '../models/Teacher';
import Activity from '../models/Activity';

//const API_URL = `http://compot-school.ru/api`; // для проды
const API_URL = `http://localhost/api`; // для локалки

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
    static getTopicsAcrossDisciplines(): Promise<AxiosResponse<{ [key: string]: string[] }>> {
        return $api.get<{ [key: string]: string[] }>('/get-topics-across-disciplines')
    }

    static getActivitiesForTeacherWithoutThemes(
        teacherId: string
    ): Promise<AxiosResponse<Activity[]>> {
        return $api.get<Activity[]>(
            '/get-activities-for-teacher-without-themes',
            {
                params: {
                    teacherId
                }
            }
        )
    }

    static sendActivityData(
        activityId: string,
        date: string,
        theme: string,
        individulComments: { [key: string]: string },
        generalComments: { [key: string]: string },
        rates: { [key: string]: number | null },
        lecturer: { [key: string]: number | string },
        attendance: {[key: string]: boolean}
    ): Promise<AxiosResponse> {
        return $api.get('/fill-activity-data',
            {
                params: {
                    activityId,
                    date,
                    theme,
                    individulComments,
                    generalComments,
                    rates,
                    lecturer,
                    attendance
                }
            }
        )
    }
}