import { makeAutoObservable, runInAction } from "mobx";
import ITeacher from "../models/Teacher";
import Server from "../Services/Server";
import IActivity, { IDay } from "../models/Activity";
import { surveyFields } from "../Pages/Comments/Comments";

export default class Teacher {

    teacher: ITeacher | null = null
    teacherCode: string = '';
    isAuth: boolean = false;
    activitiesWithoutthemes: null | IActivity[] = null

    constructor() {
        makeAutoObservable(this)
    }

    logout() {
        this.teacher = null
        this.teacherCode = ''
        this.activitiesWithoutthemes = null
        this.isAuth = false
        localStorage.setItem('teacherCode', '');
        localStorage.setItem('teacherEmail', '');
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

    async sendActivityData(
        activity: IActivity,
        date: IDay,
        theme: string,
        individulComments: { [key: string]: string },
        rates: (number | null)[],
        generalComments: { [key: string]: string },
    ) {
        const ratesWithField: { [key: string]: number | null } = {}
        rates.forEach((rateValue, number) => { // Переделать, добавить сброс полей
            ratesWithField[Object.keys(surveyFields)[number]] = rateValue
        })
        const formatedTeacher = {
            ClientId: this.teacher!.Id,
            FullName: `${this.teacher?.LastName} ${this.teacher?.FirstName}`
        }
        const response = await Server.sendActivityData(
            activity.Id,
            date.Date,
            theme,
            individulComments,
            generalComments,
            ratesWithField,
            formatedTeacher
        );
    }

}