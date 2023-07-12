import { useEffect, useState } from 'react'

const calcOffset = (el: HTMLElement | null) => (el ? el.scrollHeight - el.clientHeight - 300 : 0)

export function useReachBottomTrigger() {
  const [isBottom, setIsBottom] = useState(false)
  useEffect(() => {
    const page = document.getElementById('main-content')
    if (!page) return
    const handler = () => {
      const threshold = calcOffset(page)
      setIsBottom(page.scrollTop >= threshold)
    }
    page.addEventListener('scroll', handler)
    return () => page.removeEventListener('scroll', handler)
  }, [])
  return isBottom
}
