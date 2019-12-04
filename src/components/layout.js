import React from "react"
import layoutStyles from "./layout.module.css"

export default function Layout({ children }) {
  return <div className={layoutStyles.container}>{children}</div>
}
