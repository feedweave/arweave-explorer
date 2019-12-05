import React from "react"

import appSummaryStyles from "./app-summary.module.css"

export default function AppSummary(props) {
  const { name, description, txCount, userCount, github, link } = props
  return (
    <div className={appSummaryStyles.container}>
      <div className={appSummaryStyles.appName}>{name}</div>
      <p>{description}</p>
      <p>
        <a href={link} target="_blank" rel="noopener noreferrer">
          Launch App
        </a>
      </p>
      <p>
        <div>
          <span>Transactions:</span> {txCount}
        </div>
        <div>
          <span>Users:</span> {userCount}
        </div>
      </p>
      <p>
        <a href={github}>See code on GitHub</a>
      </p>
    </div>
  )
}
