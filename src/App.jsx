import React, { useEffect, useState } from 'react'
import ArticleSidebarComponent from './ArticleSidebarComponent.jsx'
import ArticleViewer from './ArticleViewer.jsx'
import './styles.css'

export default function App(){
  const [selected, setSelected] = useState(null)
  const [dark, setDark] = useState(false)

  useEffect(() => {
    // Listen to hash changes for simple routing: #/article/1
    function onHashChange() {
      const h = window.location.hash || ''
      const m = h.match(/#\/article\/(\d+)/)
      if (m) {
        const n = parseInt(m[1], 10)
        setSelected(n)
      } else {
        setSelected(null)
      }
    }
    window.addEventListener('hashchange', onHashChange)
    onHashChange()
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return (
    <div className={dark ? 'app dark' : 'app'}>
      <div className='topbar'>
        <div className='brand'>Article Explorer — 103 Analyses</div>
        <div className='controls'>
          <label className='switch'><input type='checkbox' checked={dark} onChange={e=>setDark(e.target.checked)} /> <span>Dark</span></label>
        </div>
      </div>
      <div className='layout'>
        <ArticleSidebarComponent onSelect={n=>{ setSelected(n); window.location.hash = `/article/${n}` }} />
        <main className='main'>
          <ArticleViewer articleNumber={selected} />
        </main>
      </div>
    </div>
  )
}