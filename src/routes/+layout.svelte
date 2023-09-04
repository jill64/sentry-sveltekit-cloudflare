<script lang="ts">
  export let data

  $: ({ title } = data)
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>
<h1>{title}</h1>
<slot />

<style>
  :global(body) {
    font-family: sans-serif;
  }
</style>
