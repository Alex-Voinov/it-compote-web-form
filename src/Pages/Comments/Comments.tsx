import { FC, useContext, useEffect } from 'react'
import Header from '../../Components/UI/Header/Header'
import styles from './Comments.module.css'
import { observer } from 'mobx-react-lite'
import { GlobalData } from '../../main'
import IActivity from '../../models/Activity'


const Comments: FC = () => {
    const { teacher } = useContext(GlobalData)
    useEffect(() => {
        if (teacher.activitiesWithoutthemes === null)
            teacher.getActivitiesForTeacherWithoutThemes();
    }, [])
    const activities = (teacher.activitiesWithoutthemes === null ? [] : teacher.activitiesWithoutthemes) as IActivity[]
    return (
        <section className={styles.wrapper}>
            <Header />
            <main>
                <section className={styles.activitiesList}>
                    <h2>
                        Выберите занятие:
                    </h2>
                    {activities.length === 0
                        ? <div>
                            Нет уроков требующий указания темы
                        </div>
                        : activities.map(
                            activity => <div key={activity.Id}>
                                {activity.Name}
                            </div>
                        )
                    }
                </section>
                <section></section>
            </main>
        </section>
    )
}

export default observer(Comments)