export default interface Activity {
    Id: string,
    Name: string,
    Discipline: string,
    Days: string[],
    Students: {[key: string]: string} // Объект ClientId - ФИО,
    Type: 'Individual' | 'Group',
    BeginTime: string,
    EndTime: string,
}