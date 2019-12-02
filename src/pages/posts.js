// import React from "react"
// import { Link, graphql } from "gatsby"

// import unified from "unified"
// import parse from "remark-parse"
// import remark2react from "remark-react"

// const PostsPage = ({ data }) => {
//   const posts = data.posts.edges
//   return (
//     <ul>
//       {posts.map(({ node }) => {
//         return (
//           <li key={node.id}>
//             <div>Post ID: {node.id}</div>
//             <div>Block hash: {node.blockHash}</div>
//             <div>
//               Owner address:{" "}
//               <Link to={`/user/${node.ownerAddress}`}>{node.ownerAddress}</Link>
//             </div>
//             <div>
//               Content:{" "}
//               {
//                 unified()
//                   .use(parse)
//                   .use(remark2react)
//                   .processSync(node.content).contents
//               }
//             </div>
//           </li>
//         )
//       })}
//     </ul>
//   )
// }

// export default PostsPage

// export const pageQuery = graphql`
//   query {
//     posts: allArweavePost {
//       edges {
//         node {
//           blockHash
//           content
//           id
//           ownerAddress
//         }
//       }
//     }
//   }
// `
