export default interface IActivity {
    Id: number,
    Type: string,
    Name: string,
    Discipline: string
    Days: {
        Date: string,
        Description: string
    }
}