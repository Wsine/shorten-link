import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function Custom404() {
  const [hint, setHint] = useState('')
  const router = useRouter()
  console.log(router.asPath)

  useEffect(() => {
    fetch(`/api/jump/${router.asPath.slice(1)}`)
    .then(r => r.json())
    .then(r => {
      window.location.href = r.link
    })
    .catch(() => {
      setHint('404 Not Found')
    })
  })

  return <p>{hint}</p>
}
