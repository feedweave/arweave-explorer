import React from "react"
import { Link } from "gatsby"

export default ({ node }) => {
  return (
    <div>
      <div>
        Post ID:
        <Link to={`/transaction/${node.id}`}>{node.id}</Link>
      </div>
      <div>Block hash: {node.blockHash}</div>
      <div>
        Owner address:
        <Link to={`/address/${node.ownerAddress}`}>{node.ownerAddress}</Link>
      </div>
    </div>
  )
}
