import styles from "./Error.module.css"
import { Link } from "react-router-dom"
function Error(){
    return <div className={styles.errorWrapper}>
        <div className={styles.errorHeader}>Error 404 - Page Not Found</div>
        <div className={styles.errorBody}>Go Back to  
            <Link to={'/'} className={styles.homeLink}>
            Home
            </Link>
            </div>
    </div>
}
export default Error