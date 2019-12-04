import React from "react"
import { Link } from "gatsby"

import txDetailStyles from "./tx-table.module.css"

export default function({ transactions }) {
  return (
    <div>
      <div className={txDetailStyles.header}>
        <span className={txDetailStyles.headerColumn}>Hash</span>
        <span className={txDetailStyles.headerColumn}>Block</span>
        <span className={txDetailStyles.headerColumn}>User</span>
        <span className={txDetailStyles.headerColumn}>Fee</span>
      </div>
      {transactions.map(({ node }) => {
        const { content } = node
        const contentSnippet =
          content.length > 200
            ? content.substring(0, 200).concat("...")
            : content
        return (
          <div key={node.id} className={txDetailStyles.container}>
            <div className={txDetailStyles.row}>
              <span className={txDetailStyles.rowColumn}>
                <Link to={`/transaction/${node.id}`}>{node.id}</Link>
              </span>
              <span className={txDetailStyles.rowColumn}>{node.blockHash}</span>
              <span className={txDetailStyles.rowColumn}>
                <Link to={`/address/${node.ownerAddress}`}>
                  {node.ownerAddress}
                </Link>
              </span>
              <span className={txDetailStyles.rowColumn}>0.234 AR</span>
            </div>
            <Link
              className={txDetailStyles.snippetLink}
              to={`/transaction/${node.id}`}
            >
              <div className={txDetailStyles.txContentSnippet}>
                {contentSnippet.split("\n").map((item, i) => (
                  <p key={i}>{item}</p>
                ))}
              </div>
            </Link>
          </div>
        )
      })}
    </div>
  )
}
