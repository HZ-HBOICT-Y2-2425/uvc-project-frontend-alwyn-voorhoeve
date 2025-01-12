<script>
    export let data;
  </script>
  
  <style>
    nav {
      background-color: #64AF64;
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #ccc;
    }
    a {
      text-decoration: none;
      margin: 0 1rem;
      color: #000000;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
  
  <nav>
    <div>
      <a href="/">Home</a>
      <a href="/Lijstje">Lijstje</a>
    </div>
  </nav>
  
  <slot />
  