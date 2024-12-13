<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  let recipe = { Name: '', Ingredients: '', Description: '' };
  let isEditing = false;
  let recipeId: string | null = null; // Initialize recipeId properly

  // Fetch the recipe ID dynamically from the URL
  $: recipeId = $page.url.pathname.split('/').pop();

  // Fetch the recipe details on mount or when recipeId changes
  onMount(async () => {
    if (recipeId) {
      await fetchRecipe(recipeId);
    }
  });

  async function fetchRecipe(id: string) {
    try {
      const response = await fetch(`http://localhost:3011/recipes/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      recipe = await response.json();
    } catch (error) {
      console.error("Error fetching recipe:", error);
    }
  }

  async function updateRecipe() {
    try {
      if (!recipeId) return;
      const response = await fetch(`http://localhost:3011/recipes/${recipeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipe),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedRecipe = await response.json();
      recipe = updatedRecipe;
      isEditing = false;
      alert('Recipe updated successfully!');
    } catch (error) {
      console.error("Error updating recipe:", error);
      alert('Failed to update recipe. Please try again.');
    }
  }

  async function deleteRecipe() {
    try {
      if (!recipeId) return;
      const response = await fetch(`http://localhost:3011/recipes/${recipeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      alert('Recipe deleted successfully!');
      goto('/'); // Redirect to the main page
    } catch (error) {
      console.error("Error deleting recipe:", error);
      alert('Failed to delete recipe. Please try again.');
    }
  }
</script>

<main class="bg-gray-100 p-4 sm:p-6 min-h-screen">
  <div class="bg-white p-6 rounded-md shadow-md">
    {#if !isEditing && recipeId}
      <h1 class="text-2xl font-bold">{recipe.Name}</h1>
      <p class="mt-4"><strong>Ingredients:</strong> {recipe.Ingredients}</p>
      <p class="mt-4"><strong>Description:</strong> {recipe.Description}</p>
      <div class="flex space-x-4 mt-6">
        <button
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          on:click={() => isEditing = true}
        >
          Edit
        </button>
        <button
          class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          on:click={deleteRecipe}
        >
          Delete
        </button>
      </div>
    {/if}

    {#if isEditing}
      <div>
        <h2 class="text-xl font-bold mb-4">Edit Recipe</h2>
        <div class="mb-4">
          <label class="block text-gray-700 font-semibold mb-2">Name:</label>
          <input
            type="text"
            bind:value={recipe.Name}
            placeholder="Recipe Name"
            class="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-semibold mb-2">Ingredients:</label>
          <textarea
            bind:value={recipe.Ingredients}
            placeholder="Ingredients"
            class="w-full p-2 border border-gray-300 rounded-md"
          ></textarea>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-semibold mb-2">Description:</label>
          <textarea
            bind:value={recipe.Description}
            placeholder="Description"
            class="w-full p-2 border border-gray-300 rounded-md"
          ></textarea>
        </div>
        <div class="flex justify-end space-x-4">
          <button
            class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            on:click={() => isEditing = false}
          >
            Cancel
          </button>
          <button
            class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            on:click={updateRecipe}
          >
            Save Changes
          </button>
        </div>
      </div>
    {/if}

    {#if !recipeId}
      <p class="text-red-600 text-center mt-4">Invalid Recipe ID.</p>
    {/if}
  </div>
</main>
