import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import recipes from "./recipes.js";

const formatCount = (count) => `${count} recipe${count === 1 ? "" : "s"}`;

export default function App() {
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState(recipes[0]?.id ?? "");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(max-width: 900px)");
    const syncSidebar = () => {
      setIsSidebarOpen(!media.matches);
    };
    syncSidebar();
    if (media.addEventListener) {
      media.addEventListener("change", syncSidebar);
      return () => media.removeEventListener("change", syncSidebar);
    }
    media.addListener(syncSidebar);
    return () => media.removeListener(syncSidebar);
  }, []);

  const handleSelect = (id) => {
    setActiveId(id);
    if (typeof window !== "undefined") {
      const media = window.matchMedia("(max-width: 900px)");
      if (media.matches) {
        setIsSidebarOpen(false);
      }
    }
  };

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
        <aside
          className={`sidebar ${isSidebarOpen ? "is-open" : "is-collapsed"}`}
        >
          <div className="sidebar-header">
            <h2>Recipes</h2>
            <button
              type="button"
              className="sidebar-toggle"
              onClick={() => setIsSidebarOpen((open) => !open)}
              aria-expanded={isSidebarOpen}
              aria-controls="recipe-list"
            >
              {isSidebarOpen ? "Hide list" : "Show list"}
            </button>
          </div>
          <div className="sidebar-panel" id="recipe-list">
            <ul>
              {filtered.map((recipe) => (
                <li key={recipe.id}>
                  <button
                    type="button"
                    className={
                      recipe.id === activeRecipe?.id ? "active" : undefined
                    }
                    onClick={() => handleSelect(recipe.id)}
                  >
                    {recipe.title}
                  </button>
                </li>
              ))}
            </ul>
            {filtered.length === 0 && (
              <p className="empty">No matches yet. Try another name.</p>
            )}
          </div>
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
