<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation'; 
  import '../app.css'; 

  let Recipes = [];
  let newRecipe = { Name: '', Ingredients: '', Description: '' };

  onMount(async () => {
    Recipes = await fetchData("recipes");
  });

  async function fetchData(db: string) {
    try {
      const response = await fetch(`http://localhost:3011/${db}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  }

  const openRecipe = (id: string) => {
    goto(`/recipes/${id}`);
  };

  async function createRecipe() {
    try {
      const response = await fetch("http://localhost:3011/recipes", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRecipe),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const createdRecipe = await response.json();
      Recipes = [...Recipes, createdRecipe];
      newRecipe = { Name: '', Ingredients: '', Description: '' };
      alert('Recipe created successfully!');
    } catch (error) {
      console.error("Error creating recipe:", error);
      alert('Failed to create recipe. Please try again.');
    }
  }

  async function deleteRecipe(id: number) {
    try {
      const response = await fetch(`http://localhost:3011/recipes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      Recipes = Recipes.filter(recipe => recipe.id !== id);
      alert('Recipe deleted successfully!');
    } catch (error) {
      console.error("Error deleting recipe:", error);
      alert('Failed to delete recipe. Please try again.');
    }
  }

  async function editRecipe(id: number, updatedRecipe) {
    try {
      const response = await fetch(`http://localhost:3011/recipes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRecipe),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const editedRecipe = await response.json();
      Recipes = Recipes.map(recipe => recipe.id === id ? editedRecipe : recipe);
      alert('Recipe updated successfully!');
    } catch (error) {
      console.error("Error updating recipe:", error);
      alert('Failed to update recipe. Please try again.');
    }
  }
</script>

<main class="bg-gray-100 p-4 sm:p-6 min-h-screen">
  <section>
    <h2 class="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Recipes</h2>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
      {#each Recipes as recipe}
        <div class="bg-white rounded-md shadow-md p-4 text-center">
          <h3 class="text-lg font-bold">{recipe.Name}</h3>
          <button 
            class="bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-700 mr-2"
            on:click={() => openRecipe(recipe.id)}
          >
            View
          </button>
          <button 
            class="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700"
            on:click={() => deleteRecipe(recipe.id)}
          >
            Delete
          </button>
        </div>
      {/each}
    </div>
  </section>

  <section class="mt-6">
    <h2 class="text-xl sm:text-2xl font-bold mb-4">Add New Recipe</h2>
    <div class="bg-white p-4 sm:p-6 rounded-md shadow-md">
      <div class="mb-4">
        <label class="block text-gray-700 font-semibold mb-2">Name:</label>
        <input
          type="text"
          bind:value={newRecipe.Name}
          placeholder="Recipe Name"
          class="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 font-semibold mb-2">Ingredients:</label>
        <textarea
          bind:value={newRecipe.Ingredients}
          placeholder="Ingredients"
          class="w-full p-2 border border-gray-300 rounded-md"
        ></textarea>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 font-semibold mb-2">Description:</label>
        <textarea
          bind:value={newRecipe.Description}
          placeholder="Description"
          class="w-full p-2 border border-gray-300 rounded-md"
        ></textarea>
      </div>
      <button
        class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        on:click={createRecipe}
      >
        Add Recipe
      </button>
    </div>
  </section>
</main>