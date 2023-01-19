<script>
  import { page } from '$app/stores';
</script>

<h1 style="color:red;">Oh no ! {$page.status} {$page.error?.message}</h1>
<a href="/">Go back</a>