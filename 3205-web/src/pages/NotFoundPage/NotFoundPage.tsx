import { Link } from 'react-router-dom'
import styles from './NotFoundPage.module.scss'

export function NotFoundPage() {
  return (
    <section className={styles.page}>
      <div>
        <p className={styles.eyebrow}>404</p>
        <h1>Страница не найдена</h1>
      </div>

      <div className={styles.body}>
        <Link className={styles.link} to="/">
          Вернуться на главную
        </Link>
      </div>
    </section>
  )
}
