<script lang="ts">
    import { onMount } from 'svelte';
  
    let shoppingList = [];
    let allIngredients = [];
    let newIngredient = '';
  
    onMount(async () => {
      await fetchIngredients();
    });
  
    async function fetchIngredients() {
      try {
        const response = await fetch('http://localhost:3011/ingredients');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        allIngredients = await response.json();
      } catch (error) {
        console.error("Error fetching ingredients:", error);
      }
    }
  
    function addToShoppingList() {
      if (!newIngredient) return;
  
      const ingredient = allIngredients.find(
        ing => ing.Name.toLowerCase() === newIngredient.toLowerCase()
      );
      if (ingredient && !shoppingList.includes(ingredient)) {
        shoppingList = [...shoppingList, ingredient];
      }
      newIngredient = '';
    }
  
    function removeFromShoppingList(id) {
      shoppingList = shoppingList.filter(item => item.IngredientId !== id);
    }
  </script>
  
  <main class="bg-gray-100 p-4 sm:p-6 min-h-screen">
    <h1 class="text-2xl font-bold mb-4">Shopping List</h1>
    <div class="mb-4">
      <input
        type="text"
        bind:value={newIngredient}
        placeholder="Enter ingredient name"
        class="w-full p-2 border border-gray-300 rounded-md"
      />
      <button
        class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 mt-2"
        on:click={addToShoppingList}
      >
        Add to Shopping List
      </button>
    </div>
    <ul class="list-disc list-inside mt-4">
      {#each shoppingList as item}
        <li>
          {item.Name}
          <button
            class="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700 ml-4"
            on:click={() => removeFromShoppingList(item.IngredientId)}
          >
            Remove
          </button>
        </li>
      {/each}
    </ul>
  </main>
  