"use client"

interface CategoryTabsProps {
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export default function CategoryTabs({ categories, activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <nav className="mb-element">
      <ul className="flex items-center gap-inline">
        {categories.map((category) => (
          <li
            key={category}
            className={`flex-1 ${activeCategory === category ? "tab tab-active" : "tab tab-inactive"}`}
            onClick={() => onCategoryChange(category)}
          >
            <span className="w-full h-full flex items-center justify-center cursor-pointer">{category}</span>
          </li>
        ))}
      </ul>
    </nav>
  )
}
