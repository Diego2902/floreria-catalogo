export default function CategoryTabs({ categories, active, onChange }) {
  return (
    <div className="tabs" role="tablist" aria-label="Filtrar por categoría">
      {categories.map((cat) => (
        <button
          key={cat}
          role="tab"
          aria-selected={active === cat}
          className={`tab ${active === cat ? 'tab-active' : ''}`}
          onClick={() => onChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}