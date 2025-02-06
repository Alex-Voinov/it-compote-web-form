function getWeekday(dateStr: string): string {
    if (typeof dateStr !== 'string' || dateStr.length === 0) return ''
    // Преобразуем строку в объект Date
    const dateObj = new Date(dateStr);
    // Опции для форматирования дня недели в предложном падеже на русском
    const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
    // Получаем день недели на русском
    const weekday = new Intl.DateTimeFormat('ru-RU', options).format(dateObj);
    // Возвращаем в предложном падеже
    const weekdaysPrepositional: Record<string, string> = {
        'понедельник': 'в понедельник',
        'вторник': 'во вторник',
        'среда': 'в среду',
        'четверг': 'в четверг',
        'пятница': 'в пятницу',
        'суббота': 'в субботу',
        'воскресенье': 'в воскресенье'
    };
    return weekdaysPrepositional[weekday] || weekday;
}

export default getWeekday