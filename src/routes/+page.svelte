<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation'; 
    import '../app.css'; 
    
    
    const BASE_URL = 'http://localhost:3010/api/recipes'; 
    
    let recipes: { id: string; name: string; description: string; image: string }[] = [];
    let ingredients: string[] = [];
    let newIngredient: string = '';
  
    
    const loadRecipes = async () => {
      try {
        recipes = await fetchRecipes();
      } catch (error) {
        console.error('Failed to load recipes:', error);
      }
    };
  
    
    const handleAddIngredient = async () => {
      if (newIngredient.trim()) {
        try {
          await addIngredient(newIngredient.trim());
          ingredients = [...ingredients, newIngredient.trim()];
          newIngredient = ''; 
        } catch (error) {
          console.error('Failed to add ingredient:', error);
        }
      }
    };
  
    
    const handleRemoveIngredient = async (index: number) => {
      const ingredient = ingredients[index];
      try {
        await removeIngredient(ingredient);
        ingredients = ingredients.filter((_, i) => i !== index); 
      } catch (error) {
        console.error('Failed to remove ingredient:', error);
      }
    };
  
    
    onMount(() => {
      loadRecipes();
    });
  
   
    const openRecipe = (id: string) => {
      goto(`/recipes/${id}`);
    };
  </script>
  
  <main class="bg-gray-100 p-6 min-h-screen">
    
    <section class="grid grid-cols-3 gap-6 mb-8">
      
      <div class="col-span-2 bg-white p-6 rounded-md shadow-md">
        <h2 class="text-xl font-semibold mb-4">Zoek recepten</h2>
        <div class="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search..."
            class="flex-1 p-2 border border-gray-300 rounded-md"
          />
          <button class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            Search
          </button>
        </div>
        <div class="mt-4">
          <label class="block mb-2 font-medium">Filters</label>
          <div class="space-x-4">
            <label><input type="checkbox" /> Lijstje Gebruiken</label>
            <label><input type="checkbox" /> Halal</label>
            <label><input type="checkbox" /> Glutenvrij</label>
            <label><input type="checkbox" /> Vegan</label>
            <label><input type="checkbox" /> Vegetarisch</label>
          </div>
        </div>
      </div>
  
     
      <div class="bg-green-100 p-6 rounded-md shadow-md">
        <h2 class="text-xl font-semibold mb-4">Jouw Lijstje</h2>
        <ul class="space-y-2">
          {#each ingredients as ingredient, index}
            <li class="flex justify-between items-center bg-white p-2 rounded-md shadow-sm">
              <span>{ingredient}</span>
              <button
                on:click={() => handleRemoveIngredient(index)}
                class="text-red-500 hover:underline"
              >
                Remove
              </button>
            </li>
          {/each}
        </ul>
        <div class="mt-4 flex items-center">
          <input
            type="text"
            bind:value={newIngredient}
            placeholder="Add an ingredient"
            class="flex-1 p-2 border border-gray-300 rounded-md"
          />
          <button
            on:click={handleAddIngredient}
            class="ml-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Add
          </button>
        </div>
      </div>
    </section>
  
    <!-- Recipe Recommendations -->
    <section>
      <h2 class="text-2xl font-bold mb-6">Aanbevolen voor jou</h2>
      <div class="grid grid-cols-3 gap-6">
        {#each recipes as recipe}
          <div
            class="bg-white rounded-md shadow-md p-4 text-center cursor-pointer hover:shadow-lg"
            role="button"
            tabindex="0"
            on:click={() => openRecipe(recipe.id)}
            on:keydown={(e) => e.key === 'Enter' && openRecipe(recipe.id)}
          >
            <img
              src="{recipe.image}"
              alt="{recipe.name}"
              class="w-full h-32 object-cover rounded-md mb-4"
            />
            <h3 class="text-lg font-bold">{recipe.name}</h3>
            <p class="text-sm text-gray-600">{recipe.description}</p>
          </div>
        {/each}
      </div>
    </section>
  </main>
  