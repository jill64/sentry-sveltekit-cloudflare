<script lang="ts">
  import { toast } from '@jill64/svelte-toast'

  let { data } = $props()

  let loadAt = $derived(data.loadAt)
  let routes = $derived(data.routes)
</script>

<p>Load at {loadAt} from Server</p>
<ul>
  {#each routes as href}
    <li>
      <a {href}>{href}</a>
    </li>
  {/each}
</ul>
<button
  onclick={() => {
    toast.error('Error from client')
    throw new Error('Error from client')
  }}
>
  Throw Error
</button>
{#each ['POST', 'PUT', 'PATCH', 'DELETE'] as method}
  <button
    onclick={async () => {
      const res = await fetch('/', { method })

      const text = await res.text()

      if (res.ok) {
        toast.success(`${res.status} ${text}`)
      } else {
        toast.error(`${res.status} ${text}`)
      }
    }}
  >
    {method}
  </button>
{/each}

<style>
  @media (prefers-color-scheme: dark) {
    :global(body) {
      background: #111;
      color: #eee;
    }
    a {
      color: #3442ac;
    }
  }
</style>
