import { FC, useContext, useEffect, useState } from 'react'
import Header from '../../Components/UI/Header/Header'
import styles from './Comments.module.css'
import { observer } from 'mobx-react-lite'
import { GlobalData } from '../../main'
import IActivity from '../../models/Activity'

const Comments: FC = () => {
    const { teacher } = useContext(GlobalData)
    const [activities, setActivities] = useState<IActivity[]>([]); 
    useEffect(() => {
         const activitiesResponse = teacher.getActivitiesForTeacherWithoutThemes();
    }, [])
    return (
        <section className={styles.wrapper}>
            <Header />
            <main>
                <section className={styles.activitiesList}>
                    <h2>
                        Выберите занятие:
                    </h2>
                </section>
                <section></section>
            </main>
        </section>
    )
}

export default observer(Comments)