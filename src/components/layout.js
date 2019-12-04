import React from "react"
import layoutStyles from "./layout.module.css"

import Header from "./header"

export default function Layout({ children }) {
  return (
    <div className={layoutStyles.container}>
      <Header />
      <div className={layoutStyles.children}>{children}</div>
    </div>
  )
}
