import { FC } from 'react'
import styles from './Timetable.module.css'
import Header from '../../Components/UI/Header/Header'

const Timetable: FC = () => {
    return (
        <section className={styles.wrapper}>
            <Header/>
            <main>
                Скоро тут будет конфетка ; )
            </main>
        </section>
    )
}

export default Timetable