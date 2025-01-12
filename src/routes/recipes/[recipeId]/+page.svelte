<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  let recipeId: number;
  interface Recipe {
    Name: string;
    Ingredients: string[];
    Description: string;
  }

  let recipe: Recipe = {
    Name: '',
    Ingredients: [],
    Description: ''
  };
  let newIngredient = '';
  let errorMessage = '';
  let successMessage = '';
  let isEditing = false;

  // Fetch the recipe by ID
  async function fetchRecipe() {
    try {
      const response = await fetch(`http://localhost:3011/recipes/${recipeId}`);
      if (!response.ok) throw new Error('Error fetching recipe');
      const data = await response.json();
      recipe = data;
    } catch (error: any) {
      errorMessage = 'Error fetching recipe: ' + error.message;
    }
  }

  // Update recipe function
  async function updateRecipe() {
    if (!recipe.Name || !recipe.Description || recipe.Ingredients.length === 0) {
      errorMessage = 'Please provide valid ingredients, name, and description.';
      return;
    }

    const updatedRecipe = {
      id: recipeId,
      Name: recipe.Name,
      Ingredients: recipe.Ingredients,
      Description: recipe.Description
    };

    try {
      const response = await fetch(`http://localhost:3011/recipes/${recipeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedRecipe)
      });

      if (!response.ok) throw new Error('Error updating recipe');
      const data = await response.json();

      successMessage = 'Recipe updated successfully!';
      goto(`/recipes/${data.id}`);  
    } catch (error) {
      if (error instanceof Error) {
        errorMessage = 'Error updating recipe: ' + error.message;
      } else {
        errorMessage = 'Error updating recipe';
      }
    }
  }

  // Add new ingredient (by name) to the recipe
  function addIngredientToRecipe() {
    if (newIngredient.trim()) {
      if (!recipe.Ingredients.includes(newIngredient.trim())) {
        recipe.Ingredients.push(newIngredient.trim());
        newIngredient = ''; 
      }
    }
  }

  // Delete recipe function
  async function deleteRecipe() {
    try {
      const response = await fetch(`http://localhost:3011/recipes/${recipeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error deleting recipe');
      successMessage = 'Recipe deleted successfully!';
      goto('/');  
    } catch (error) {
      if (error instanceof Error) {
        errorMessage = 'Error deleting recipe: ' + error.message;
      } else {
        errorMessage = 'Error deleting recipe';
      }
    }
  }

  // Initialize the page with the recipe data
  onMount(() => {
    const pathname = window.location.pathname;
    if (pathname) {
      recipeId = parseInt(pathname.split('/').pop() || '', 10); 
    }
    fetchRecipe();
  });
</script>

<main class="p-8 bg-gray-50 min-h-screen">
  <button
    class="mt-6 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
    on:click={() => goto('/')}
  >
    Back
  </button>
  <h1 class="text-3xl font-semibold text-center mb-8">Recipe Details</h1>

  {#if errorMessage}
    <div class="bg-red-500 text-white p-4 rounded-md mb-4">{errorMessage}</div>
  {/if}

  {#if successMessage}
    <div class="bg-green-500 text-white p-4 rounded-md mb-4">{successMessage}</div>
  {/if}

  {#if !isEditing}
    <div class="bg-white p-6 rounded-md shadow-md">
      <h2 class="text-2xl font-semibold">{recipe.Name}</h2>
      <p class="mt-4"><strong>Description:</strong> {recipe.Description}</p>
      <p class="mt-4"><strong>Ingredients:</strong></p>
      <ul class="list-disc pl-5">
        {#each recipe.Ingredients as ingredient}
          <li class="text-gray-700">{ingredient}</li>
        {/each}
      </ul>
      <div class="flex space-x-4 mt-6">
        <button
          on:click={() => isEditing = true}
          class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Edit Recipe
        </button>
        <button
          on:click={deleteRecipe}
          class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Delete Recipe
        </button>
      </div>
    </div>
  {/if}

  {#if isEditing}
    <h1 class="text-3xl font-semibold text-center mb-8">Edit Recipe</h1>
    <form on:submit|preventDefault={updateRecipe} class="space-y-6 max-w-lg mx-auto">
      <div class="flex flex-col space-y-2">
        <label for="name" class="font-medium text-lg">Recipe Name</label>
        <input
          id="name"
          type="text"
          bind:value={recipe.Name}
          placeholder="Enter recipe name"
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="flex flex-col space-y-2">
        <label for="description" class="font-medium text-lg">Description</label>
        <textarea
          id="description"
          bind:value={recipe.Description}
          placeholder="Enter recipe description"
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>

      <div class="flex flex-col space-y-2">
        <label for="ingredients" class="font-medium text-lg">Ingredients</label>
        <input
          id="ingredients"
          type="text"
          bind:value={newIngredient}
          placeholder="Add ingredient (e.g. Tomato)"
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          on:click={addIngredientToRecipe}
          class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Add Ingredient
        </button>
      </div>

      <div class="flex flex-col space-y-2">
        <label class="font-medium text-lg">Current Ingredients:</label>
        <ul class="list-disc pl-5">
          {#each recipe.Ingredients as ingredient}
            <li class="text-gray-700">{ingredient}</li>
          {/each}
        </ul>
      </div>

      <div class="flex justify-between">
        <button
          type="button"
          on:click={() => isEditing = false}
          class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Save Changes
        </button>
      </div>
    </form>
  {/if}
</main>