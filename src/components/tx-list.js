import React from "react"
import Layout from "./layout"
import Tx from "./tx"

export default props => {
  const { pageContext, data } = props
  const { appName } = pageContext
  const { edges } = data.allArweaveTransaction

  return (
    <Layout>
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
    </Layout>
  )
}
