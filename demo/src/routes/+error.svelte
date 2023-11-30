<script lang="ts">
  import { page } from '$app/stores'
  import { toast } from '@jill64/svelte-toast'

  $: if ($page.error) {
    $toast.error($page.error.message)
  }
</script>

<h1>Error Page</h1>
<p>message:{$page.error?.message}</p>
<p>EventId: {$page.error?.sentryEventId}</p>
