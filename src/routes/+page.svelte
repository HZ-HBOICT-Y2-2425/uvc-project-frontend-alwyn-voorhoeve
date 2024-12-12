<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation'; 
  import '../app.css'; 

  let Recipes;
  let Ingredients;
  let newRecipe = { Name: '', Ingredients: '', Description: '' }; // Holds new recipe data

  onMount(async () => {
    Recipes = await fetchData("recipes");
    console.log(Recipes);
  });

  async function fetchData(db) {
    try {
      const response = await fetch("http://localhost:3011/" + db);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      let data = await response.json();
      console.log(data);
      return data;
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
    console.log('Sending new recipe:', newRecipe);

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
    Recipes = [...Recipes, createdRecipe]; // Update Recipes list
    newRecipe = { Name: '', Ingredients: '', Description: '' }; // Clear form
    alert('Recipe created successfully!');
  } catch (error) {
    console.error("Error creating recipe:", error);
    alert('Failed to create recipe. Please try again.');
  }
}

</script>

<main class="bg-gray-100 p-4 sm:p-6 min-h-screen">
  
  <section class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">

    <!-- Search Recipes -->
    <div class="sm:col-span-2 bg-white p-4 sm:p-6 rounded-md shadow-md">
      <h2 class="text-lg sm:text-xl font-semibold mb-4">Zoek recepten</h2>
      <div class="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <input
          type="text"
          placeholder="Search..."
          class="w-full sm:flex-1 p-2 border border-gray-300 rounded-md"
        />
        <button class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
          Search
        </button>
      </div>
    </div>

  </section>

  
  <!-- Recipe Recommendations -->
  <section>
    <h2 class="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Aanbevolen voor jou</h2>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
      {#each Recipes as recipe}
        <div
          class="bg-white rounded-md shadow-md p-4 text-center cursor-pointer hover:shadow-lg"
          role="button"
          tabindex="0"
          on:click={() => openRecipe(recipe.id)}
          on:keydown={(e) => e.key === 'Enter' && openRecipe(recipe.id)}
        >
          <h3 class="text-lg font-bold">{recipe.Name}</h3>
        </div>
      {/each}
    </div>
  </section> 

  <section class="mt-6">
    <h2 class="text-xl sm:text-2xl font-bold mb-4">Nieuw Recept Toevoegen</h2>
    <div class="bg-white p-4 sm:p-6 rounded-md shadow-md">
      <div class="mb-4">
        <label class="block text-gray-700 font-semibold mb-2">Naam:</label>
        <input
          type="text"
          bind:value={newRecipe.Name}
          placeholder="Naam van het recept"
          class="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 font-semibold mb-2">Ingrediënten (gescheiden door komma's):</label>
        <textarea
          bind:value={newRecipe.Ingredients}
          placeholder="Bijv. Tomaat, Kaas, Gehakt"
          class="w-full p-2 border border-gray-300 rounded-md"
        ></textarea>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 font-semibold mb-2">Beschrijving:</label>
        <textarea
          bind:value={newRecipe.Description}
          placeholder="Korte beschrijving van het recept"
          class="w-full p-2 border border-gray-300 rounded-md"
        ></textarea>
      </div>
      <button
        class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        on:click={createRecipe}
      >
        Recept Toevoegen
      </button>
    </div>
  </section>
</main>
