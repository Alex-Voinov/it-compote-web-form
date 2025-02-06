import { makeAutoObservable, runInAction, toJS } from "mobx";
import ITeacher from "../models/Teacher";
import Server from "../Services/Server";
import { surveyFields } from "../Pages/Comments/Comments";
import Activity from "../models/Activity";


export default class Teacher {

    teacher: ITeacher | null = null
    teacherCode: string = '';
    isAuth: boolean = false;
    activitiesWithoutthemes: null | Activity[] = null

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

    deleteActivity(selectedActivity: Activity, selectedDay: string, activityData: Activity[]) {
        console.log('Было')
        console.log(toJS(this.activitiesWithoutthemes))
        runInAction(() => {
            if (selectedActivity.Days.length === 1) {
                const activityListWithoutOldActivity = activityData.filter(act => act.Id !== selectedActivity.Id);
                this.activitiesWithoutthemes = activityListWithoutOldActivity;
            }
            else {
                const activityListWithoutOneDay = activityData.map(
                    act => {
                        if (act.Id === selectedActivity.Id) {
                            console.log('активность найдена')
                            return {
                                ...act,
                                Days: act.Days.filter(day => day !== selectedDay)
                            }
                        }
                        return act
                    }

                );
                this.activitiesWithoutthemes = activityListWithoutOneDay;
            }
            console.log('Стало')
            console.log(toJS(this.activitiesWithoutthemes))
        })
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
            this.activitiesWithoutthemes = findActivities && Array.isArray(findActivities) ? findActivities : null;
        });
    }

    async sendActivityData(
        activityId: string,
        date: string,
        theme: string,
        individulComments: { [key: string]: string },
        rates: (number | null)[],
        generalComments: { [key: string]: string },
        attendance: { [key: string]: boolean }
    ) {
        const ratesWithField: { [key: string]: number | null } = {}
        rates.forEach((rateValue, number) => { // Переделать, добавить сброс полей
            ratesWithField[Object.keys(surveyFields)[number]] = rateValue
        })
        const formatedTeacher = {
            ClientId: this.teacher!.Id,
            FullName: `${this.teacher?.LastName} ${this.teacher?.FirstName}`
        }
        await Server.sendActivityData(
            activityId,
            date,
            theme,
            individulComments,
            generalComments,
            ratesWithField,
            formatedTeacher,
            attendance
        );
    }

}