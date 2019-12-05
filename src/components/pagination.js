import React from "react"
import { Link } from "gatsby"
import styles from "./pagination.module.css"

export default function({
  currentPage,
  numPages,
  prevLink,
  nextLink,
  firstLink,
  lastLink,
}) {
  return (
    <div className={styles.container}>
      <Link to={firstLink}>
        <div className={styles.first}>First</div>
      </Link>
      <Link to={prevLink}>
        <div className={styles.prev}>&lt;</div>
      </Link>
      <div className={styles.count}>
        Page {currentPage} of {numPages}
      </div>
      <Link to={nextLink}>
        <div className={styles.next}>&gt;</div>
      </Link>
      <Link to={lastLink}>
        <div className={styles.last}>Last</div>
      </Link>
    </div>
  )
}
