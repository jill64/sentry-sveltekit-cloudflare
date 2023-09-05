<script lang="ts">
  import { Toaster } from 'svelte-french-toast'

  export let data

  $: ({ title } = data)
</script>

<Toaster position="bottom-left" />
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
