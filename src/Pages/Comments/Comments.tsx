import { FC, useContext, useEffect, useState } from 'react'
import Header from '../../Components/UI/Header/Header'
import styles from './Comments.module.css'
import { observer } from 'mobx-react-lite'
import { GlobalData } from '../../main'
import IActivity from '../../models/Activity'
import Loader from '../../Components/Decoration/Loader/Loader'

const Comments: FC = () => {
    const { teacher } = useContext(GlobalData)
    const [isLoading, setLoading] = useState(false)
    useEffect(() => {
        if (teacher.activitiesWithoutthemes === null && teacher.teacher) {
            setLoading(true);
            teacher.getActivitiesForTeacherWithoutThemes().finally(
                () => setLoading(false)
            )
        }
    }, [teacher.teacher])
    const activities = (teacher.activitiesWithoutthemes === null ? [] : teacher.activitiesWithoutthemes) as IActivity[]
    return (
        <section className={styles.wrapper}>
            <Header />
            <main>
                <section className={styles.activitiesList}>
                    <h2>
                        Выберите занятие:
                    </h2>
                    {
                        isLoading ?
                            <div className={styles.wrapperLoader}>
                                <Loader />
                            </div>
                            : (activities.length === 0
                                ? <div className={styles.notFindedActivities}>
                                    Нет уроков, требующих указания темы
                                    <button onClick={e => {
                                        e.preventDefault();
                                        setLoading(true);
                                        teacher.getActivitiesForTeacherWithoutThemes().finally(
                                            () => setLoading(false)
                                        )
                                    }}>
                                        Обновить
                                    </button>
                                </div>
                                : activities.map(
                                    activity => <div
                                        className={styles.findedActivities}
                                        key={activity.Id}
                                    >
                                        <div>{activity.Name}: {activity.Type}</div>
                                        <div>{activity.Discipline}</div>
                                    </div>
                                )
                            )}
                </section>
                <section></section>
            </main>
        </section>
    )
}

export default observer(Comments)