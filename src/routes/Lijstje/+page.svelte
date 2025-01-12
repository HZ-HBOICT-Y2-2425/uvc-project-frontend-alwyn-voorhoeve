<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let shoppingList: { id: number; Name: string }[] = [];
  let newItem = '';
  let errorMessage = '';
  let successMessage = '';
  

  // Fetch shopping list
  async function fetchShoppingList() {
    try {
      const response = await fetch('http://localhost:3011/shoppingList');
      if (!response.ok) throw new Error('Error fetching shopping list');
      shoppingList = await response.json();
    } catch (error) {
      errorMessage = 'Error fetching shopping list: ' + (error as Error).message;
    }
  }

  // Add item to shopping list
  async function addItem() {
    if (!newItem.trim()) {
      errorMessage = 'Item name cannot be empty';
      return;
    }

    try {
      const response = await fetch('http://localhost:3011/shoppingList', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Name: newItem }),
      });

      if (!response.ok) throw new Error('Error adding item');
      const addedItem = await response.json();
      shoppingList.push(addedItem);
      newItem = '';
      successMessage = 'Item added successfully!';
    } catch (error) {
      errorMessage = 'Error adding item: ' + (error as Error).message;
    }
  }

  // Delete item from shopping list
  async function deleteItem(id: number) {
    try {
      const response = await fetch(`http://localhost:3011/shoppingList/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error deleting item');
      shoppingList = shoppingList.filter((item) => item.id !== id);
      successMessage = 'Item deleted successfully!';
    } catch (error) {
      errorMessage = 'Error deleting item: ' + (error as Error).message;
    }
  }

  onMount(() => {
    fetchShoppingList();
  });
</script>

<main class="p-4 bg-gray-50 min-h-screen text-gray-800">

  <h1 class="text-2xl font-bold text-center mb-8 py-2  rounded-lg">Shopping List</h1>

  {#if errorMessage}
    <div class="bg-red-100 text-red-800 border border-red-300 p-4 rounded-lg mb-4">
      {errorMessage}
    </div>
  {/if}

  {#if successMessage}
    <div class="bg-green-100 text-green-800 border border-green-300 p-4 rounded-lg mb-4">
      {successMessage}
    </div>
  {/if}

  <div class="mb-6">
    <input
      type="text"
      bind:value={newItem}
      placeholder="Add new item"
      class="w-full px-4 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button
      class="bg-blue-500 text-white px-4 py-2 mt-2 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
      on:click={addItem}
    >
      Add Item
    </button>
  </div>

  <ul class="space-y-4">
    {#each shoppingList as item}
      <li class="flex justify-between items-center bg-green shadow-sm p-4 rounded-lg border border-black">
        <span class="text-lg font-medium">{item.Name}</span>
        <button
          class="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-400 focus:outline-none"
          on:click={() => deleteItem(item.id)}
        >
          Delete
        </button>
      </li>
    {/each}
  </ul>
</main>
