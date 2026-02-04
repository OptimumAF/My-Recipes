const recipeFiles = import.meta.glob("/Recipes/*.md", {
  eager: true,
  query: "?raw",
  import: "default"
});

const toTitle = (fileName) =>
  fileName
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const recipes = Object.entries(recipeFiles)
  .map(([path, content]) => {
    const file = path.split("/").pop() || "";
    const base = file.replace(/\.md$/i, "");
    return {
      id: base.toLowerCase().replace(/_/g, "-"),
      title: toTitle(base),
      content
    };
  })
  .sort((a, b) => a.title.localeCompare(b.title));

export default recipes;