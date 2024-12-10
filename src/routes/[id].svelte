<script lang="ts">
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { fetchRecipes, addIngredient, removeIngredient } from '$lib/api'; // Import the functions from the original code
    import '../app.css'; // Import global styles
   // Import the functions from the original code
  
    let recipeId = $page.params.id; // Extract the recipe ID
    let recipe = null;
  
    const fetchRecipe = async () => {
      const response = await fetch(`/api/recipes/${recipeId}`); // Replace with your endpoint
      if (response.ok) {
        recipe = await response.json();
      }
    };
  
    fetchRecipe();
  </script>
  
  {#if recipe}
    <div class="p-6">
      <h1 class="text-3xl font-bold">{recipe.name}</h1>
      <img src="{recipe.image}" alt="{recipe.name}" class="w-full h-64 object-cover rounded-md mt-4" />
      <p class="mt-4 text-gray-600">{recipe.description}</p>
    </div>
  {/if}
  