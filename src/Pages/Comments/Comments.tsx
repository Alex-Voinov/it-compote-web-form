import { FC, useContext, useEffect, useRef, useState } from 'react'
import Header from '../../Components/UI/Header/Header'
import styles from './Comments.module.css'
import { observer } from 'mobx-react-lite'
import { GlobalData } from '../../main'
import IActivity, { IDay } from '../../models/Activity'
import Loader from '../../Components/Decoration/Loader/Loader'
import formatDate from '../../utilities/formatedTime'


const Comments: FC = () => {
    const { teacher, disciplanaryTopics } = useContext(GlobalData)
    const [isLoading, setLoading] = useState(false)
    const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);
    const [selectedDay, setSelectedDay] = useState<IDay | null>(null);
    const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
    const [openWindowThemes, setOpenWindowThemes] = useState(false);
    
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (teacher.activitiesWithoutthemes === null && teacher.teacher) {
            setLoading(true);
            teacher.getActivitiesForTeacherWithoutThemes().finally(
                () => setLoading(false)
            )
        }
    }, [teacher.teacher])
    useEffect(() => {
        if (!disciplanaryTopics.uploaded) disciplanaryTopics.upload()
    })

    const handleOutsideClick = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setOpenWindowThemes(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

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
                                        className={`${styles.findedActivities}  ${activity.Id === selectedActivity?.Id && styles.selected}`}
                                        key={activity.Id}
                                        onClick={() => {
                                            setSelectedActivity(activity);
                                            setSelectedDay(null);
                                            setSelectedTheme(null);
                                        }}
                                    >
                                        <div>{activity.Name}: {activity.Type}</div>
                                        <div>{activity.Discipline}</div>
                                    </div>
                                )
                            )}
                </section>
                <section className={styles.fillingWindow}>
                    {selectedActivity && <><nav>
                        {selectedActivity.Days.map(day => <div
                            key={day.Date}
                            className={`${styles.oneDay} ${day === selectedDay && styles.selected}`}
                            onClick={() => {
                                setSelectedDay(day);
                                setSelectedTheme(null);
                            }}
                        >
                            {formatDate(day.Date)}
                        </div>
                        )}
                    </nav>
                        {selectedDay && <section className={styles.openLesson}>
                            <div className={styles.row}>
                                <h1>Выберите тему урока</h1>
                                <div className={styles.dropDawn} onClick={()=>setOpenWindowThemes(true)}>
                                    <p>{selectedTheme ? selectedTheme : '–'}</p>
                                    {openWindowThemes && <div className={styles.pointList} ref={dropdownRef}>
                                        {disciplanaryTopics.get(selectedActivity.Discipline).map(theme => {
                                            const formatedThemes = theme.replace(/^[\s\*]+|[\s\*]+$/g, '')

                                            return <div
                                                key={formatedThemes}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setSelectedTheme(formatedThemes);
                                                    setOpenWindowThemes(false)
                                                }}
                                            >
                                                {formatedThemes}
                                            </div>
                                        })}
                                    </div>}
                                </div>
                            </div>
                        </section>}
                    </>}
                </section>
            </main>
        </section>
    )
}

export default observer(Comments)