import { FC } from 'react'
import styles from './Loader.module.css'

const Loader: FC = () => {
    return (
        <img className={styles.wrapper} src='/svg/loader.svg'/>
    )
}

export default Loader