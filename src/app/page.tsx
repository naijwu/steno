import Transcribe from '@/components/Transcribe'
import styles from './page.module.css'
import { headers } from 'next/headers'

export default function Home() {

  const headersList = headers()
  const userAgent = headersList.get('user-agent')
  const isMobile = userAgent?.includes('iPhone') || userAgent?.includes('Android') || userAgent?.includes('iPad') || false

  return (
    <div className={styles.container}>
      <Transcribe isMobile={isMobile} />
    </div>
  )
}
