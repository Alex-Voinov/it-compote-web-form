export default interface Activity {
    Id: string,
    Name: string,
    Discipline: string,
    Days: string[],
    Students: {
        [key: string]: {
            name: string,
            days: string[]
        }
    } // Объект ClientId - {name: ФИО, days: дни занятий},
    Type: 'Individual' | 'Group',
    BeginTime: string,
    EndTime: string,
}