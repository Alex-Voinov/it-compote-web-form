export interface IDay{
    Date: string,
    Description: string
}



export default interface IActivity {
    Id: number,
    Type: string,
    Name: string,
    Discipline: string,
    Days: IDay[],
    Students?: {[key: string]: string} // Объект ClientId - ФИО
}