import {FC} from 'react'
import styles from './FullScreanLoader.module.css'

const FullScreanLoader: FC = () => {
  return (
    <section className={styles.skin}>
        <div>Пожалуйста, подождите, идет отправка запроса</div>
    </section>
  )
}

export default FullScreanLoader