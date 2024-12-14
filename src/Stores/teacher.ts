import { makeAutoObservable, runInAction } from "mobx";
import ITeacher from "../models/Teacher";
import Server from "../Services/Server";
import IActivity from "../models/Activity";

export default class Teacher {

    teacher: ITeacher | null = null
    teacherCode: string = '';
    isAuth: boolean = false;
    activitiesWithoutthemes: null | IActivity[] = null

    constructor() {
        makeAutoObservable(this)
    }

    setTeacherCode(email: string, code: string, teacher: ITeacher) {
        this.teacherCode = code;
        this.isAuth = true;
        this.teacher = teacher;
        localStorage.setItem('teacherCode', code);
        localStorage.setItem('teacherEmail', email);
    }

    async checkVerification() {
        const possibleCode = localStorage.getItem('teacherCode');
        const possibleEmail = localStorage.getItem('teacherEmail');
        if (!possibleCode || !possibleEmail) {
            runInAction(() => {
                this.isAuth = false;
                return false
            });
        }
        return Server.verifyTeacher(possibleEmail as string, possibleCode as string).then(
            (res) => {
                runInAction(() => {
                    this.isAuth = true;
                    this.teacherCode = possibleCode as string;
                    this.teacher = res.data;
                });
                return true;
            }
        ).catch(

            () => {
                runInAction(() => {
                    this.isAuth = false; // можно явно указать, чтобы состояние сбрасывалось
                });
                return false
            }
        )
    }

    async getActivitiesForTeacherWithoutThemes() {
        const serverResponse = await Server.getActivitiesForTeacherWithoutThemes(String(this.teacher?.Id));
        const findActivities = serverResponse.data
        runInAction(() => {
            this.activitiesWithoutthemes = findActivities ? findActivities : [];
        });
    }
}