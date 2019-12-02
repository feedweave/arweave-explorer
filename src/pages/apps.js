import React from "react"
import { graphql, Link } from "gatsby"

const AppList = ({ data }) => {
  const { edges } = data.allArweaveApp

  return (
    <div>
      <h1>Arweave apps</h1>
      <ul>
        {edges.map(({ node: { name } }) => (
          <li key={name}>
            <Link to={`/app/${name}`}>{name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AppList

export const pageQuery = graphql`
  query {
    allArweaveApp {
      totalCount
      edges {
        node {
          name
        }
      }
    }
  }
`
