import { FC } from 'react'
import styles from './NavigationMenu.module.css'


const NavigationMenu: FC = () => {
    return (
        <section className={styles.wrapper}>
            <input type="text" placeholder='HH email' />
            <input type="text" placeholder='Password' />
            <button>Войти</button>
        </section>
    )
}

export default NavigationMenu