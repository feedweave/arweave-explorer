const path = require("path")

const axios = require("axios")
const crypto = require("crypto")
const groupBy = require("lodash/groupBy")

const fetchPosts = () =>
  axios.get(
    `https://gateway.arweave.co/transactions/app-name/arweave-blog-0.0.1`
  )

exports.sourceNodes = async ({ actions }) => {
  const { createNode } = actions

  const res = await fetchPosts()

  res.data.map((user, i) => {
    const { id, blockHash, ownerAddress, content } = user

    const postNode = {
      id,
      parent: `__SOURCE__`,
      internal: {
        type: `ArweavePost`,
      },
      children: [],
      blockHash,
      ownerAddress,
      content,
    }

    const contentDigest = crypto
      .createHash(`md5`)
      .update(JSON.stringify(postNode))
      .digest(`hex`)

    postNode.internal.contentDigest = contentDigest
    createNode(postNode)
  })

  return
}

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  const result = await graphql(
    `
      {
        posts: allArweavePost {
          edges {
            node {
              blockHash
              content
              id
              ownerAddress
            }
          }
        }
      }
    `
  )
  const posts = result.data.posts.edges
  const postsByOwner = groupBy(posts, post => post.node.ownerAddress)

  const userTemplate = path.resolve("./src/templates/user-template.js")

  Object.keys(postsByOwner).forEach(owner => {
    createPage({
      path: `/user/${owner}`,
      component: userTemplate,
      context: {
        ownerAddress: owner,
      },
    })
  })
}
