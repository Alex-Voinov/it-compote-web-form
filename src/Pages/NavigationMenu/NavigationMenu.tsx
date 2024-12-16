import { FC, useContext, useState } from 'react'
import styles from './NavigationMenu.module.css'
import Server from '../../Services/Server';
import Loader from '../../Components/Decoration/Loader/Loader';
import { useNavigate } from 'react-router-dom';
import { GlobalData } from '../../main';

const unknownError = 'Неизвестная ошибка'
const beautifulLoginLength = 14

const NavigationMenu: FC = () => {
    const {teacher} = useContext(GlobalData)
    const navigate = useNavigate()
    const [email, setEmail] = useState('');
    const [isLoading, setLoading] = useState(false)
    const [password, setPassword] = useState('');
    const [erMessage, setErMessage] = useState('')
    const hasEmptyField = !(email.length > 0 && password.length > 0)

    return (
        <section className={styles.wrapper}>
            {isLoading
                ? <div className={styles.wrapperLoader}>
                    <Loader />
                </div>
                : (erMessage ? <>
                    <h1>Не удалось соверишить вход в систему</h1>
                    <p>{erMessage}</p>
                    <button onClick={e => {
                        e.preventDefault();
                        setErMessage('');
                    }}>
                        Ок
                    </button>
                </>
                    : <form>
                        <input
                            type="email"
                            placeholder='HH email'
                            onChange={e => setEmail(e.target.value)}
                            value={email}
                            autoComplete="new-password"
                            style={
                                email.length > beautifulLoginLength
                                    ? { fontSize: 2 - (email.length - beautifulLoginLength) * 0.05 + 'vw' }
                                    : {}
                            }
                        />
                        <input
                            type="password"
                            placeholder='Password'
                            onChange={e => setPassword(e.target.value)} value={password}
                            autoComplete="new-password"
                        />
                        <button
                            className={hasEmptyField ? styles.hidden : ''}
                            disabled={hasEmptyField}
                            onClick={e => {
                                e.preventDefault();
                                setLoading(true)
                                Server.verifyTeacher(email, password).then(
                                    res => {
                                        teacher.setTeacherCode(email, password, res.data)
                                        navigate('/comments')
                                    }
                                ).catch(
                                    er => {
                                        const erMsg = er.response.data.message
                                        setErMessage((er.status === 404 && erMsg) ? erMsg : unknownError)
                                    }
                                ).finally(
                                    () => setLoading(false)
                                )
                            }}>
                            Войти
                        </button>
                    </form>)
            }
        </section>
    )
}

export default NavigationMenu