import { mapCompanyLogo } from './JobListTable.tsx'
import { useState, useEffect } from 'react'

type Categories = Record<string, string[]>

export function Companies() {
  const [search, setSearch] = useState("")
  const [categories, setCategories] = useState<Categories>({})
  useEffect(() => {
    fetch("http://localhost:8000/companies/categories")
      .then(r => r.json())
      .then((data: Array<{ name: string, type: string }>) => {
        const grouped: Categories = {}
        data.forEach(({ name, type }) => {
          if (!grouped[type]) {
            grouped[type] = []
          }
          grouped[type].push(name)
        })
        setCategories(grouped)
      })
      .catch(e => console.error("Failed to fetch categories:", e))
  }, [])

  const openCareersPage = async (company: string) => {
    try {
      const response = await fetch(`http://localhost:8000/companies/${encodeURIComponent(company)}/careers`)
      const data = await response.json()
      console.log(data)
      if (data.url) {
        window.open(data.url, '_blank')
      }
    } catch (e) {
      console.error(e)
    }
  }


  const filteredCategories = Object.entries(categories).map(([category, companies]) => {
    const searchLower = search.toLowerCase()

    // If category matches, show all companies in it
    if (category.toLowerCase().includes(searchLower)) {
      return [category, companies] as [string, string[]]
    }

    // Otherwise filter companies
    const filtered = companies.filter(company =>
      company.toLowerCase().includes(searchLower)
    )
    return [category, filtered] as [string, string[]]
  }).filter(([_, companies]) => companies.length > 0)

  return (
    <div className="companies-page">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <input
          type="text"
          className="search-input"
          placeholder="Search companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {filteredCategories.map(([category, companies]) => (
        <div key={category} className="company-category">
          <h2 className="category-title">{category}</h2>
          <div className="company-grid">
            {[...companies].sort((a, b) => a.localeCompare(b)).map((company) => (
              <div
                key={company}
                className="company-card"
                onClick={() => openCareersPage(company)}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={`../logos/${mapCompanyLogo(company)}.png`}
                  alt={company}
                  className="company-logo"
                  onError={(e) => e.currentTarget.style.display = 'none'}
                />
                <span className="company-name">{company}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
