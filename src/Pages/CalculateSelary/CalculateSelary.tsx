import { FC, useContext, useEffect, useState } from 'react'
import Header from '../../Components/UI/Header/Header'
import styles from './CalculateSelary.module.css'
import { observer } from 'mobx-react-lite'
import { GlobalData } from '../../main'
import IMonthlyPaymentSummary from '../../models/MonthlyPaymentSummary'
import Loader from '../../Components/Decoration/Loader/Loader'




const titles = {
    'Дата': { text: 'date', width: '14%' },
    'Дисциплина': { text: 'discipline', width: '20%' },
    'Тип': { text: 'type', width: '20%' },
    'Ученик': { text: 'student', width: '20%' },
    'Монетки': { text: 'money', width: '8%' },
    'Пропуск': { text: 'isPass', width: '8%' },
    'Id': { text: 'id', width: '8%' },
}

const CalculateSelary: FC = () => {
    const { teacher } = useContext(GlobalData)
    const [isLoading, setLoading] = useState(false);
    const [selectMonth, setSelectMonth] = useState<null | IMonthlyPaymentSummary>()
    useEffect(() => {
        setLoading(true)
        teacher.getPaymentsData().then(
            result => {
                console.log(result)
                setSelectMonth(result)
            }
        ).finally(() => { setLoading(false) });
    }, [])
    const monthsData = teacher.payments
    return (
        <section className={styles.wrapper}>
            <Header />
            <main>
                {isLoading
                    ? <div className={styles.loadBlock}>
                        <div>
                            <Loader />
                        </div>
                        <h1>Идет загрузка данных...</h1>
                    </div>
                    : monthsData.length > 0
                        ? <section className={styles.mainContent}>
                            <header className={styles.monthsRow}>
                                <><div className={styles.mountWrapper}>
                                    {monthsData.map(month => <div
                                        className={month === selectMonth ? styles.active : ''}
                                        onClick={() => {
                                            setSelectMonth(month)
                                        }}
                                    >
                                        {month.monthName}
                                    </div>)}
                                </div>
                                    <div className={styles.total}>
                                        {`Всего за ${selectMonth?.monthName}: ${selectMonth?.AmounPayments}`}
                                    </div>
                                </>

                            </header>
                            <section className={styles.paymentData}>
                                <header>
                                    {Object.entries(titles).map(title => <div
                                        style={{//@ts-ignore
                                            width: title[1].width
                                        }}
                                    >
                                        {title[0]}
                                    </div>
                                    )}
                                </header>
                                <main>
                                    {selectMonth && selectMonth.data.map(rowData => <div className={styles.row}>
                                        {Object.values(titles).map(fieldName => <div
                                            style={{//@ts-ignore
                                                width: fieldName.width
                                            }}
                                        >{
                                                // @ts-ignore
                                                fieldName.text === 'isPass' ? rowData[fieldName.text] == true ? '+' : '-' : rowData[fieldName.text]
                                            }</div>)}
                                    </div>)}
                                </main>
                            </section>
                        </section> 
                        : <div className={styles.notFound}>
                            Не найденно данных о педагоге
                        </div>}
            </main>
        </section>
    )
}

export default observer(CalculateSelary)