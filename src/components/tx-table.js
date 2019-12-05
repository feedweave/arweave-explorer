import React from "react"
import { Link } from "gatsby"

import txDetailStyles from "./tx-table.module.css"

export function TxHeader() {
  return (
    <div className={txDetailStyles.header}>
      <span className={txDetailStyles.headerColumn}>Hash</span>
      <span className={txDetailStyles.headerColumn}>Block</span>
      <span className={txDetailStyles.headerColumn}>User</span>
      <span className={txDetailStyles.headerColumn}>Fee</span>
    </div>
  )
}
export function TxDetail({ node, expanded }) {
  const { content, id, ownerAddress, blockHash, tags } = node
  const filteredTags = tags.filter(
    ({ name, value }) => value.length < 100 && value !== ""
  )
  let contentSnippet
  if (expanded) {
    contentSnippet = content
  } else {
    contentSnippet =
      content.length > 200 ? content.substring(0, 200).concat("...") : content
  }
  return (
    <div key={id} className={txDetailStyles.container}>
      <div className={txDetailStyles.row}>
        <span className={txDetailStyles.rowColumn}>
          <Link to={`/transaction/${id}`}>{id}</Link>
        </span>
        <span className={txDetailStyles.rowColumn}>{blockHash}</span>
        <span className={txDetailStyles.rowColumn}>
          <Link to={`/address/${ownerAddress}`}>{ownerAddress}</Link>
        </span>
        <span className={txDetailStyles.rowColumn}>0.234 AR</span>
      </div>
      <div className={txDetailStyles.body}>
        <Link className={txDetailStyles.snippetLink} to={`/transaction/${id}`}>
          <div className={txDetailStyles.txContentSnippet}>
            <div className={txDetailStyles.txContentSnippetHeader}>Data:</div>
            <div className={txDetailStyles.txContentSnippetText}>
              {contentSnippet.split("\n").map((item, i) => (
                <p key={i}>{item}</p>
              ))}
            </div>
          </div>
        </Link>
        <div className={txDetailStyles.tags}>
          {expanded ? (
            <div
              style={{ marginBottom: 15 }}
              className={txDetailStyles.txContentSnippetHeader}
            >
              Tags:
            </div>
          ) : null}
          {filteredTags.map(({ name, value }) => {
            return (
              <div className={txDetailStyles.tag}>
                <span className={txDetailStyles.tagKey}>{name}:</span>
                <span className={txDetailStyles.tagValue}>{value}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function({ transactions }) {
  return (
    <div>
      <TxHeader />
      {transactions.map(({ node }) => {
        return <TxDetail node={node} />
      })}
    </div>
  )
}
