import React from "react"
import { Link } from "gatsby"

import appListStyles from "./app-list.module.css"

function AppItem({ name }) {
  return (
    <Link to={`/app/${name}`}>
      <div className={appListStyles.itemContainer}>{name}</div>
    </Link>
  )
}

export default function AppList({ apps }) {
  return (
    <ul className={appListStyles.container}>
      {apps.map(({ node: { name } }) => (
        <li key={name}>
          <AppItem name={name} />
        </li>
      ))}
    </ul>
  )
}
