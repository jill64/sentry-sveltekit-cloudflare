<script lang="ts">
  import { page } from '$app/stores'

  export let data

  $: ({ loadAt, routes } = data)

  $: token = $page.url.searchParams.get('token')
</script>

<p>Load at {loadAt} from Server</p>
<ul>
  {#each routes as href}
    <li>
      <a href="{href}?token={token}">{href}</a>
    </li>
  {/each}
</ul>
<button
  on:click={() => {
    alert('Error from client')
    throw new Error('Error from client')
  }}
>
  Throw Error
</button>
{#each ['POST', 'PUT', 'PATCH', 'DELETE'] as method}
  <button
    on:click={async () => {
      const res = await fetch(`/?token=${token}`, {
        method
      })
      const text = await res.text()
      alert(`${res.status} ${text}`)
    }}
  >
    {method}
  </button>
{/each}
