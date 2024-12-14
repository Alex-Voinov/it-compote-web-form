import { FC, useState } from 'react'
import styles from './NavigationMenu.module.css'
import Server from '../../Services/Server';
import Loader from '../../Components/Decoration/Loader/Loader';

const unknownError = 'Неизвестная ошибка'
const beautifulLoginLength = 14

const NavigationMenu: FC = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setLoading] = useState(false)
    const [password, setPassword] = useState('');
    const [erMessage, setErMessage] = useState('')
    const hasEmptyField = !(email.length > 0 && password.length > 0)
    console.log(erMessage)
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
                    : <>
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
                                    res => { console.log(123) }
                                ).catch(
                                    er => {
                                        console.log(er)
                                        const erMsg = er.response.data.message
                                        setErMessage((er.status === 404 && erMsg) ? erMsg : unknownError)
                                    }
                                ).finally(
                                    () => setLoading(false)
                                )
                            }}>
                            Войти
                        </button>
                    </>)
            }
        </section>
    )
}

export default NavigationMenu