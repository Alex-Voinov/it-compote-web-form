import { FC, useContext, useEffect, useRef, useState, Dispatch, SetStateAction } from 'react'
import Header from '../../Components/UI/Header/Header'
import styles from './Comments.module.css'
import { observer } from 'mobx-react-lite'
import { GlobalData } from '../../main'
import Loader from '../../Components/Decoration/Loader/Loader'
import formatDate from '../../utilities/formatedTime'
import getWeekday from '../../utilities/getWeekDay'
import Activity from '../../models/Activity'
import FullScreanLoader from '../../Components/Decorate/FullScreanLoader/FullScreanLoader'


export const surveyFields = {
    satisfaction: 'Удовлетворенность уроком',
    Feelings: 'Как я себя чувствовал?',
    FeelingsStudent: 'Как себя чувствовали студенты?',

}

interface IRatingScale {
    title: string,
    state: [number | null, Dispatch<SetStateAction<number | null>>]
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
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null); // Категории слева
    const [selectedDay, setSelectedDay] = useState<string | null>(null); // Дни сверху
    const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
    const [isSendingReq, setSendingReq] = useState(false);
    const [openWindowThemes, setOpenWindowThemes] = useState(false);
    const [activeComposition, setActiveComposition] = useState(Composition.General);
    const surveyAnswers = Object.keys(surveyFields).map(() => useState<number | null>(null))
    const availableNextStep = selectedTheme && surveyAnswers[0][0] && surveyAnswers[1][0]
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const [positiveAspects, setPositiveAspects] = useState('');
    const [growthPoints, setGrowthPoints] = useState('');
    const [generalQuestions, setGeneralQuestions] = useState('');
    const [selectedStudentForComment, setSelectedStudentForComment] = useState<null | string>(null);
    const [individulComments, setIndividulComments] = useState<{ [key: string]: string }>({})
    const [attendance, setAttendance] = useState<{ [key: string]: boolean }>({}) // Посещаемость, спасибо чудесному API хх, за необходимость добавления этого поля

    // Сброс выбранный рейтов
    const resetRate = () => {
        for (let surveyAnswer of surveyAnswers) {
            surveyAnswer[1](null);
        }
        setActiveComposition(Composition.General)
        setAttendance({})
        setPositiveAspects('')
        setGrowthPoints('')
        setGeneralQuestions('')
        setSelectedTheme(null)
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

    const allDisciplanes = Object.keys(disciplanaryTopics.allTopic)
    const activities = teacher.activitiesWithoutthemes ? teacher.activitiesWithoutthemes.filter(
        act => act.Type === 'Individual' || allDisciplanes.includes(act.Discipline)
    ) : []

    const notActivities = activities.length === 0
    const studentsByActivity = (selectedActivity?.Students && Object.keys(selectedActivity?.Students).length > 0) ? selectedActivity.Students : null

    useEffect(() => {
        if (studentsByActivity && selectedDay && selectedActivity) {
            const startedComment = Object.entries(studentsByActivity).filter(
                studentData => selectedActivity.Type === 'Individual' || studentData[1].days.includes(selectedDay)
            ).reduce(
                (acc, value) => {
                    acc[value[0]] = '';
                    return acc;
                },
                {} as { [key: string]: string }
            ) // объект id студентов - пустые строки (начальные комментарии)
            setIndividulComments(startedComment)
            const startedAttendance = Object.keys(startedComment).reduce((acc, id) => {
                acc[id] = true;
                return acc;
            }, {} as { [key: string]: boolean })
            setAttendance(startedAttendance)
        }
    }, [selectedActivity, selectedDay])

    return (
        <section className={styles.wrapper}>
            {isSendingReq && <FullScreanLoader />}
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
                            : (notActivities
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
                                : activities.map( // id групп
                                    group => <div
                                        className={`
                                            ${styles.findedActivities}  ${group.Id === selectedActivity?.Id && styles.selected}`
                                        }
                                        key={group.Id}
                                        onClick={() => {
                                            setSelectedActivity(group);
                                            setSelectedDay(null);
                                            setSelectedTheme(null);
                                            resetRate()
                                        }}
                                    >
                                        <div>{group.Name}: {group.Type}</div>
                                        <div>{group.Discipline}</div>
                                        <div>Занятие проходит {getWeekday(group.Days[0])} с {group.BeginTime} до {group.EndTime}</div>
                                    </div>
                                )
                            )}
                </section>
                <section className={styles.fillingWindow}>
                    {selectedActivity && <>
                        <nav>
                            {selectedActivity.Days.map(day => <div
                                key={day}
                                className={`${styles.oneDay} ${day === selectedDay && styles.selected}`}
                                onClick={() => {
                                    setSelectedDay(day);
                                    setSelectedTheme(null);
                                    resetRate()
                                }}
                            >
                                {formatDate(day)}
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
                                    <h1>
                                        {selectedStudentForComment
                                            ? studentsByActivity![selectedStudentForComment].name
                                            : 'Общие комментарии'}
                                    </h1>
                                    {selectedStudentForComment
                                        ? <><textarea
                                            placeholder='Индивидуальный комментарий для студента'
                                            className={styles.individualTextarea}
                                            onChange={e => {
                                                setIndividulComments({ ...individulComments, [selectedStudentForComment]: e.target.value })
                                            }}
                                            value={selectedStudentForComment in individulComments ? individulComments[selectedStudentForComment] : ''}
                                        />
                                            <button className={styles.saveComments}
                                                onClick={
                                                    e => {
                                                        e.preventDefault();
                                                        setSelectedStudentForComment(null);
                                                    }}
                                            >
                                                Сохранить все индивидуальные комментарии
                                            </button>
                                        </>
                                        : <>
                                            <textarea
                                                placeholder='Что было позитивного на занятии?'
                                                onChange={e => setPositiveAspects(e.target.value)}
                                                value={positiveAspects}
                                            />
                                            <textarea
                                                placeholder='Какие точки роста видишь у себя в опыте, знаниях?'
                                                onChange={e => setGrowthPoints(e.target.value)}
                                                value={growthPoints}
                                            />
                                            <textarea
                                                placeholder='Общие вопросы к другим подразделениям школы'
                                                onChange={e => setGeneralQuestions(e.target.value)}
                                                value={generalQuestions}
                                            />
                                        </>}
                                </div>
                                {studentsByActivity && <div className={styles.personalComments}>
                                    <div className={styles.textUnderStudentList}>
                                        Отметь кто присутствовал. <br />
                                        Можешь оставить индивидуальный комментарий.
                                    </div>
                                    {Object.entries(studentsByActivity).filter(
                                        studentData => selectedActivity.Type === 'Individual' || studentData[1].days.includes(selectedDay)
                                    ).map(studentData => {
                                        const [id, studentInfo] = studentData;
                                        return <div
                                            key={id}
                                            className={`${styles.studentCard} ${id === selectedStudentForComment && styles.active}`}
                                            onClick={() => {
                                                if (attendance[id] === false)
                                                    setSelectedStudentForComment(id)
                                            }}
                                        >
                                            <h3 className={styles.studentName}>
                                                {studentInfo.name}
                                            </h3>
                                            <div
                                                className={styles.attendanceMark}
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    setAttendance({ ...attendance, [id]: !attendance[id] })
                                                    console.log(attendance)
                                                }}
                                            >
                                                {(attendance[id] === false) && <div />}
                                            </div>
                                        </div>
                                    })}
                                </div>}
                            </div>
                            {!selectedStudentForComment && <div className={styles.buttonBlockSecondComp}>
                                <button onClick={e => {
                                    e.preventDefault();
                                    setActiveComposition(Composition.General)
                                }}>
                                    Назад
                                </button>
                                <button onClick={e => {
                                    e.preventDefault();
                                    setSendingReq(true);
                                    teacher.sendActivityData(
                                        selectedActivity.Id,
                                        selectedDay,
                                        selectedTheme!,
                                        individulComments,
                                        surveyAnswers.map(state => state[0]),
                                        {
                                            positiveAspects,
                                            growthPoints,
                                            generalQuestions
                                        },
                                        attendance
                                    ).then(() => {
                                        teacher.deleteActivity(selectedActivity, selectedDay, activities)
                                        resetRate()
                                        setSelectedDay(null);
                                    }).catch(
                                        (er) => console.log(er)
                                    ).finally(() => { 
                                        setSelectedActivity(null);
                                        setSendingReq(false);
                                    });

                                }}>
                                    Сохранить
                                </button>
                            </div>}
                        </>)
                        }
                    </>}
                </section>
            </main >
        </section >
    )
}

export default observer(Comments)