import Skeleton from 'react-loading-skeleton'
import styles from './commentSkeleton.module.css'

const CommentSkeleton = () => {
  return (
    <div className={styles.cardSkeleton}>
        <div className={styles.leftCol}>
            <Skeleton circle width={40} height={40}/>
        </div>
        <div className={styles.rightCol}>
        <Skeleton />
        </div>
    </div>
  )
}

export default CommentSkeleton