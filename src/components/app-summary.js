import React from "react"

import appSummaryStyles from "./app-summary.module.css"

export default function AppSummary(props) {
  const {
    appName,
    appDescription,
    transactionCount,
    userCount,
    gitHubLink,
    appLink,
  } = props
  return (
    <div className={appSummaryStyles.container}>
      <div className={appSummaryStyles.appName}>{appName}</div>
      <p>{appDescription}</p>
      <p>
        <a href={appLink}>Launch App</a>
      </p>
      <p>
        <div>
          <span>Transactions:</span> {transactionCount}
        </div>
        <div>
          <span>Users:</span> {userCount}
        </div>
      </p>
      <p>
        <a href={gitHubLink}>See code on GitHub</a>
      </p>
    </div>
  )
}
