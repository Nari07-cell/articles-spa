import React, { useEffect, useState } from 'react'

export default function ArticleViewer({ articleNumber }){
  const [article, setArticle] = useState(null)

  useEffect(() => {
    if (!articleNumber) {
      setArticle(null)
      return
    }
    async function load() {
      try {
        const res = await fetch('/api/article/' + articleNumber + '.json')
        if (!res.ok) {
          const all = await fetch('/articles_for_website_no_urls.json').then(r=>r.json())
          const a = all.find(x=>x.article_number===articleNumber)
          setArticle(a || null)
        } else {
          const a = await res.json()
          setArticle(a)
        }
      } catch (e) {
        const all = await fetch('/articles_for_website_no_urls.json').then(r=>r.json())
        const a = all.find(x=>x.article_number===articleNumber)
        setArticle(a || null)
      }
    }
    load()
  }, [articleNumber])

  if (!articleNumber) {
    return <div className='placeholder'><h2>Welcome</h2><p>Select an article from the sidebar to view its content. You can also open <code>#/article/1</code> (change 1) to deep-link.</p></div>
  }

  if (!article) return <div className='placeholder'><p>Loading...</p></div>

  return (
    <article className='article-card'>
      <h1>{article.title}</h1>
      <div className='meta'>{article.source} • {article.date || ''} • {article.length_target || ''} • Word Count: {article.word_count || ''}</div>
      <hr />
      <section dangerouslySetInnerHTML={{__html: article.introduction_html || article.introduction || ''}}></section>
      <section dangerouslySetInnerHTML={{__html: article.body_html || article.body || ''}}></section>
      <section dangerouslySetInnerHTML={{__html: article.conclusion_html || article.conclusion || ''}}></section>
        {
    /* Hide diagram placeholder lines that contain 'Diagram Placeholder' or are empty */
  }
  {(() => {
    const dp = (article.diagram_placeholder || '').trim();
    if (!dp) return null;
    const lowered = dp.toLowerCase();
    if (lowered.includes('diagram placeholder') || lowered.match(/^\[?diagram/i)) return null;
    return <div className='diagram'>{dp}</div>;
  })()}

    </article>
  )
}