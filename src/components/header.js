import React from "react"
import { Link } from "gatsby"
import headerStyles from "./header.module.css"

export default function Header() {
  return (
    <div className={headerStyles.container}>
      <Link to="/">
        <h1>Arweave App Data Explorer</h1>
      </Link>
    </div>
  )
}
