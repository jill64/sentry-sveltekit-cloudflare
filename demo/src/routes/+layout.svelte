<script lang="ts">
  import { Toaster } from '@jill64/svelte-toast'

  let { data, children } = $props()

  let title = $derived(data.title)
</script>

<Toaster />
<svelte:head>
  <title>{title}</title>
</svelte:head>
<h1>{title}</h1>
{@render children()}

<style>
  :global(body) {
    font-family: sans-serif;
  }
</style>
