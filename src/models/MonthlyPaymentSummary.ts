interface IActivityReport{
    date: string;
    discipline: string;
    type: string;
    student: string;
    money: number;
    isPass: boolean;
    id: number;
}

export default interface IMonthlyPaymentSummary {
    monthName: string;
    AmounPayments: number;
    data: IActivityReport[]
}

