import { mapCompanyLogo } from './JobListTable.tsx'
import { useState } from 'react'

const CATEGORIES = {
  "Big Tech": ["Google", "Amazon", "Microsoft", "Meta", "Apple", "Oracle", "Netflix", "Nvidia", "X"],
  "Fintech": ["Stripe", "Revolut", "Adyen", "Checkout.com", "Wise", "PayPal", "Square", "Block", "Plaid", "Airwallex", "Visa", "Mastercard", "American Express", "GoCardless", "TrueLayer", "Modulr", "Form3", "Primer", "Marqeta"],
  "Infrastructure": ["Datadog", "Snowflake", "Databricks", "Cloudflare", "MongoDB", "Twilio", "HashiCorp"],
  "Payment Infrastructure": ["GoCardless", "TrueLayer", "Modulr", "Form3", "Primer", "Marqeta"],
  "Finance & Banking": ["JPMorgan", "Goldman Sachs", "Morgan Stanley", "Bloomberg", "LSEG", "Bank of America", "Citi", "HSBC", "Barclays", "Monzo", "Starling"],
  "Quant & AI": ["Citadel", "Two Sigma", "Jane Street", "DE Shaw", "Point72", "Millennium", "HRT", "OpenAI", "Anthropic", "xAI", "Brevan Howard", "Marshall Wace"],
  "Crypto & Prediction": ["Coinbase", "Kraken", "Binance", "Polymarket", "Kalshi"],
  "Consumer Tech": ["Uber", "Deliveroo", "Spotify", "Discord", "Notion", "Slack", "Shopify", "Airbnb"],
}


export function Companies() {
  const [search, setSearch] = useState("")

  const openCareersPage = async (company: string) => {
    try {
      const response = await fetch(`http://localhost:8000/companies/${encodeURIComponent(company)}/careers`)
      const data = await response.json()
      if (data.url) {
        window.open(data.url, '_blank')
      }
    } catch (error) {
      console.error('Failed to fetch careers URL:', error)
    }
  }

  const filteredCategories = Object.entries(CATEGORIES).map(([category, companies]) => {
    const filtered = companies.filter(company =>
      company.toLowerCase().includes(search.toLowerCase())
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
