import Transcribe from '@/components/Transcribe'
import styles from './page.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Transcribe />
    </div>
  )
}
