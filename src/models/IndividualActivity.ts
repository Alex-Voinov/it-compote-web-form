export default interface IIndividualActivity {
    Id: string,
    Name: string,
    Discipline: string,
    Days: string[],
    Students?: {[key: string]: string} // Объект ClientId - ФИО,
    Type: 'Individual'
}