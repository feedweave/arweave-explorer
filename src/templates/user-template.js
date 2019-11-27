import React from "react"
import { graphql } from "gatsby"

import unified from "unified"
import parse from "remark-parse"
import remark2react from "remark-react"

const User = ({ pageContext, data }) => {
  const { ownerAddress } = pageContext
  const { edges } = data.allArweavePost

  return (
    <div>
      <div>Posts by {ownerAddress}</div>
      <ul>
        {edges.map(({ node }) => {
          return (
            <li>
              <div>Post ID: {node.id}</div>
              <div>Block hash: {node.blockHash}</div>
              <div>Owner address: {node.ownerAddress}</div>
              <div>
                Content:{" "}
                {
                  unified()
                    .use(parse)
                    .use(remark2react)
                    .processSync(node.content).contents
                }
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default User

export const pageQuery = graphql`
  query($ownerAddress: String) {
    allArweavePost(filter: { ownerAddress: { eq: $ownerAddress } }) {
      totalCount
      edges {
        node {
          id
          content
          ownerAddress
          blockHash
        }
      }
    }
  }
`
