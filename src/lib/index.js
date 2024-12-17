import React, { useState, useEffect } from "react";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [lijstje, setLijstje] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/recipes")
      .then(response => response.json())
      .then(data => setRecipes(data))
      .catch(error => console.error("Error fetching recipes:", error));

    fetch("http://localhost:5000/lijstje")
      .then(response => response.json())
      .then(data => setLijstje(data.ingredients))
      .catch(error => console.error("Error fetching lijstje:", error));
  }, []);

  const addIngredientsToLijstje = ingredients => {
    fetch("http://localhost:5000/lijstje", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients }),
    })
      .then(response => response.json())
      .then(data => setLijstje(data.ingredients))
      .catch(error => console.error("Error adding to lijstje:", error));
  };

  const clearLijstje = () => {
    fetch("http://localhost:5000/lijstje", {
      method: "DELETE",
    })
      .then(() => setLijstje([]))
      .catch(error => console.error("Error clearing lijstje:", error));
  };

  return (
    <div>
      <h1>Recipes</h1>
      <ul>
        {recipes.map(recipe => (
          <li key={recipe.id}>
            <h2>{recipe.name}</h2>
            <button onClick={() => addIngredientsToLijstje(recipe.ingredients)}>
              Add Ingredients to Lijstje
            </button>
          </li>
        ))}
      </ul>

      <h1>Lijstje</h1>
      <ul>
        {lijstje.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      {lijstje.length > 0 && (
        <button onClick={clearLijstje}>Clear Lijstje</button>
      )}
    </div>
  );
}

export default App;
