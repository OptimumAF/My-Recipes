import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import recipes from "./recipes.js";

const formatCount = (count) => `${count} recipe${count === 1 ? "" : "s"}`;

export default function App() {
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState(recipes[0]?.id ?? "");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return recipes;
    return recipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(normalized)
    );
  }, [query]);

  const activeRecipe =
    filtered.find((recipe) => recipe.id === activeId) ||
    filtered[0] ||
    recipes[0];

  useEffect(() => {
    if (activeRecipe && activeRecipe.id !== activeId) {
      setActiveId(activeRecipe.id);
    }
  }, [activeRecipe, activeId]);

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <p className="eyebrow">Offline recipe box</p>
          <h1>My Recipes</h1>
          <p className="subhead">
            Browse, search, and cook without a connection. Install from your
            browser menu to add it to your home screen.
          </p>
        </div>
        <div className="topbar-meta">
          <div className="count">{formatCount(recipes.length)}</div>
          <label className="search">
            <span>Search</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Find a recipe"
              aria-label="Search recipes"
            />
          </label>
        </div>
      </header>

      <main className="content">
        <aside className="sidebar">
          <h2>Recipes</h2>
          <ul>
            {filtered.map((recipe) => (
              <li key={recipe.id}>
                <button
                  type="button"
                  className={
                    recipe.id === activeRecipe?.id ? "active" : undefined
                  }
                  onClick={() => setActiveId(recipe.id)}
                >
                  {recipe.title}
                </button>
              </li>
            ))}
          </ul>
          {filtered.length === 0 && (
            <p className="empty">No matches yet. Try another name.</p>
          )}
        </aside>

        <section className="recipe">
          {activeRecipe ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {activeRecipe.content}
            </ReactMarkdown>
          ) : (
            <p className="empty">Select a recipe to get started.</p>
          )}
        </section>
      </main>
    </div>
  );
}
