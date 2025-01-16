export default interface IGroupActivity {
    Days: string[], // Массив дней без комментариев
    Students: { [key: string]: string }, // объект id студента - имя
    Name: string,
    Discipline: string
}