import { makeAutoObservable } from "mobx";
import ITeacher from "../models/Teacher";
import Server from "../Services/Server";

export default class Teacher {

    teacer: ITeacher | null = null
    teacherCode: string = '';
    isAuth: boolean = false;

    constructor() {
        makeAutoObservable(this)
    }

    setTeacherCode(email: string, code: string, teacer: ITeacher) {
        this.teacherCode = code;
        this.isAuth = true;
        this.teacer = teacer;
        localStorage.setItem('teacherCode', code);
        localStorage.setItem('teacherEmail', email);
    }

    async checkVerification() {
        const possibleCode = localStorage.getItem('teacherCode');
        const possibleEmail = localStorage.getItem('teacherEmail');
        if (!possibleCode || !possibleEmail) {
            this.isAuth = false;
            return false
        }
        return Server.verifyTeacher(possibleEmail, possibleCode).then(
            (res) => {
                this.isAuth = true;
                this.teacherCode = possibleCode;
                this.teacer = res.data;
                return true;
            }
        ).catch(
            () => false
        )

    }

}