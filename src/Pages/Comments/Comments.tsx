import { FC, useContext, useEffect, useRef, useState } from 'react'
import Header from '../../Components/UI/Header/Header'
import styles from './Comments.module.css'
import { observer } from 'mobx-react-lite'
import { GlobalData } from '../../main'
import IActivity, { IDay } from '../../models/Activity'
import Loader from '../../Components/Decoration/Loader/Loader'
import formatDate from '../../utilities/formatedTime'

const surveyFields = {
    completeness: 'Насколько  закончена тема?',
    satisfaction: 'Удовлетворенность уроком',
    Feelings: 'Как я себя чувствовал?',
    FeelingsStudent: 'Как себя чувствовали студенты?',

}

interface IRatingScale {
    title: string,
    state: [number | null, React.Dispatch<React.SetStateAction<number | null>>]
}

const RatingScale: FC<IRatingScale> = ({ title, state }) => {
    const [valueRating, setValueRating] = state;
    return (
        <div className={styles.row}>
            <h1>{title}</h1>
            <div className={styles.buttonBlock}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
                    value => <button
                        key={`${title}-${value}`}
                        className={`${styles.rateButton} ${valueRating === value && styles.active}`}
                        onClick={e => {
                            e.preventDefault();
                            setValueRating(value)
                        }}
                    >
                        {value}
                    </button>
                )}
            </div>
        </div>
    );
};

enum Composition {
    General,
    Comments
}

const Comments: FC = () => {
    const { teacher, disciplanaryTopics } = useContext(GlobalData)
    const [isLoading, setLoading] = useState(false)
    const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null); // Категории слева
    const [selectedDay, setSelectedDay] = useState<IDay | null>(null); // Дни сверху
    const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
    const [openWindowThemes, setOpenWindowThemes] = useState(false);
    const [activeComposition, setActiveComposition] = useState(Composition.General);
    const surveyAnswers = Object.keys(surveyFields).map(() => useState<number | null>(null))
    const availableNextStep = selectedTheme && surveyAnswers[0][0] && surveyAnswers[1][0]
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const [positiveAspects, setPositiveAspects] = useState('');
    const [growthPoints, setGrowthPoints] = useState('');
    const [generalQuestions, setGeneralQuestions] = useState('');

    // Сброс выбранный рейтов
    const resetRate = () => {
        for (let surveyAnswer of surveyAnswers) {
            surveyAnswer[1](null);
            setActiveComposition(Composition.General)
        }
    }

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
    const allActivities = (teacher.activitiesWithoutthemes === null ? [] : teacher.activitiesWithoutthemes) as IActivity[] // Все найденные активности, включая условные планерки
    const activities = allActivities.filter(activity=> Object.keys(disciplanaryTopics.allTopic).includes(activity.Discipline)) // Учебные активности, по дисциплинам из гугл таблицы
    const studentsByActivity = (selectedActivity?.Students && Object.keys(selectedActivity?.Students).length > 0) ? selectedActivity.Students : null
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
                                            resetRate()
                                        }}
                                    >
                                        <div>{activity.Name}: {activity.Type}</div>
                                        <div>{activity.Discipline}</div>
                                    </div>
                                )
                            )}
                </section>
                <section className={styles.fillingWindow}>
                    {selectedActivity && <>
                        <nav>
                            {selectedActivity.Days.map(day => <div
                                key={day.Date}
                                className={`${styles.oneDay} ${day === selectedDay && styles.selected}`}
                                onClick={() => {
                                    setSelectedDay(day);
                                    setSelectedTheme(null);
                                    resetRate()
                                }}
                            >
                                {formatDate(day.Date)}
                            </div>
                            )}
                        </nav>
                        {selectedDay && (activeComposition === Composition.General ? <section className={styles.openLesson}>
                            <div className={styles.row}>
                                <h1>Выберите тему урока</h1>
                                <div className={styles.dropDawn} onClick={() => setOpenWindowThemes(true)}>
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
                            {Object.values(surveyFields).map((title, number) => {
                                return <RatingScale title={title} state={surveyAnswers[number]} key={title} />
                            })}
                            {availableNextStep && <div className={styles.nextStepWrapper}>
                                <button onClick={e => {
                                    e.preventDefault();
                                    setActiveComposition(Composition.Comments)
                                }}>
                                    Далее
                                </button>
                            </div>}
                        </section> : <>
                            <div className={styles.commentsBlock}>
                                <div className={styles.mainComments}>
                                    <h1>Общие комментарии</h1>
                                    <textarea
                                        placeholder='Что было позитивного на занятии?'
                                        onChange={e => setPositiveAspects(e.target.value)}
                                        value={positiveAspects} />
                                    <textarea
                                        placeholder='Какие точки роста видишь у себя в опыте, знаниях?'
                                        onChange={e => setGrowthPoints(e.target.value)}
                                        value={growthPoints} />
                                    <textarea
                                        placeholder='Общие вопросы к другим подразделениям школы'
                                        onChange={e => setGeneralQuestions(e.target.value)}
                                        value={generalQuestions}
                                    />
                                </div>
                                {studentsByActivity && <div className={styles.personalComments}>
                                    <h1>Индивидуальные комментарии</h1>
                                    {Object.entries(studentsByActivity).map(studentData => {
                                        const [id, fullName] = studentData;
                                        return <div key={id} className={styles.studentCard}>
                                            {fullName}
                                        </div>
                                    })}
                                </div>}
                            </div>
                            <div className={styles.buttonBlockSecondComp}>
                                <button onClick={e => {
                                    e.preventDefault();
                                    setActiveComposition(Composition.General)
                                }}>Назад
                                </button>
                                <button onClick={e => {
                                    e.preventDefault();
                                }}>Сохранить
                                </button>
                            </div>
                        </>)
                        }
                    </>}
                </section>
            </main>
        </section>
    )
}

export default observer(Comments)