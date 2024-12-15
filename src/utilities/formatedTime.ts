const monthNames: string[] = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
];

const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const month = monthNames[date.getMonth()];
    const day = date.getDate();

    return `${month}, ${day}`;
};

export default formatDate;

