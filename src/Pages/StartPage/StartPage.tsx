import { FC } from 'react'
import styles from './StartPage.module.css'
import Loader from '../../Components/Decoration/Loader/Loader'
import { useContext, useEffect } from "react";
import { GlobalData } from '../../main';
import { useNavigate } from 'react-router-dom';


const StartPage: FC = () => {
    const { teacher } = useContext(GlobalData);
    const navigate = useNavigate();
    useEffect(() => {
        teacher.checkVerification().then((resultVerify) => {
            if (!resultVerify)
                navigate('/login')
            else navigate('/comments')
        }).catch(() => { navigate('/login') })

    }, [])
    return (
        <section className={styles.wrapper}>
            <div className={styles.wrapperLoader}>
                <Loader />
            </div>
            <h2>Верификация</h2>
        </section>
    )
}

export default StartPage