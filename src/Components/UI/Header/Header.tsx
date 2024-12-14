import { FC, useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite';
import { GlobalData } from '../../../main';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Header.module.css'

const navigatePoints: { [key: string]: string } = {
    comments: 'Комментарии к урокам',
    timetable: 'Расписание',
    'calculate-selary': 'Расчет зарплаты'
}

const Header: FC = () => {
    const { teacher } = useContext(GlobalData)
    const navigate = useNavigate();
    const pathParts = location.pathname.split('/').filter(Boolean);

    useEffect(() => {
        if (!teacher.isAuth) navigate('/')
    }, [])
    return (
        <header className={styles.wrapper}>
            <nav>
                {Object.keys(navigatePoints).map(urlTitle => {
                    return <div
                        key={urlTitle}
                        className={styles.navigatePoint}
                    >
                        <Link to={'/' + urlTitle} className={
                            pathParts.includes(urlTitle) 
                                ? styles.nonActive
                                : styles.active
                        }
                        >
                            {navigatePoints[urlTitle]}
                        </Link>
                    </div>
                })}
            </nav>
            <div>{teacher.teacer?.LastName} {teacher.teacer?.FirstName}</div>
        </header>
    )
}

export default observer(Header)