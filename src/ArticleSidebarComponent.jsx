import React, { useEffect, useState } from 'react'

export default function ArticleSidebarComponent({ jsonPath = '/articles_for_website_no_urls.json', defaultPosition = 'right', onSelect }) {
  const [articles, setArticles] = useState([])
  const [position, setPosition] = useState(defaultPosition) // 'top' | 'bottom' | 'left' | 'right'
  const [query, setQuery] = useState('')
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(jsonPath)
        const data = await res.json()
        const enhanced = data.map(a => ({
          article_number: a.article_number,
          short: (a.title || `Article ${a.article_number}`).slice(0, 80),
          title: a.title || `Article ${a.article_number}`,
          source: a.source || ''
        }))
        setArticles(enhanced)
      } catch (e) {
        console.error('Failed loading articles JSON', e)
      }
    }
    load()
  }, [jsonPath])

  const filtered = articles.filter(a => {
    if (!query) return true
    return a.title.toLowerCase().includes(query.toLowerCase()) || String(a.article_number) === query
  })

  return (
    <aside className="sidebar-panel" role="navigation" aria-label="Articles list">
      <div className="sidebar-search">
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search title or #" aria-label="Search articles" />
        <button onClick={()=>setCollapsed(!collapsed)} aria-label="Collapse">{collapsed? '▸':'▾'}</button>
      </div>
      {!collapsed && <ul className="sidebar-list">
        {filtered.map(a=> (
          <li key={a.article_number} className="sidebar-item" onClick={()=> onSelect && onSelect(a.article_number) }>
            <div style={{overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', width:'80%'}}><strong>{a.article_number}.</strong> {a.short}</div>
            <div style={{color:'#94a3b8'}}>▸</div>
          </li>
        ))}
      </ul>}
    </aside>
  )
}