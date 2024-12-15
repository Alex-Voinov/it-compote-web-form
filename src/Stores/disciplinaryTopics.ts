import { makeAutoObservable, runInAction } from "mobx";
import Server from "../Services/Server";

export default class DisciplanaryTopics {
    allTopic: { [key: string]: string[] } = {}
    uploaded = false;

    constructor() {
        makeAutoObservable(this)
    }

    get(discipline: string) {
        return this.allTopic[discipline]
    }

    async upload() {
        const response = await Server.getTopicsAcrossDisciplines();
        const topics = response.data;
        runInAction(() => {
            this.allTopic = topics;
            this.uploaded = true;
        });
    }
}