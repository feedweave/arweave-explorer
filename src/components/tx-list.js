import React from "react"
import Tx from "./tx"

export default props => {
  const { pageContext, data } = props
  const { appName } = pageContext
  const { edges } = data.allArweaveTransaction

  return (
    <div>
      <div>App: {appName}</div>
      <ul>
        {edges.map(({ node }) => {
          return (
            <li key={node.id}>
              <Tx node={node} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
