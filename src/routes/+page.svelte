<script lang="ts">
	import type { ActionData } from './$types';
  import { enhance, type SubmitFunction } from '$app/forms';

  let isConnected: boolean = false;
  let loading = false;

  export let form: ActionData;

  const handleSubmit: SubmitFunction = () => {
    loading = true;

    return async ({result, update}) => {
      await update();
      if (result.type === "success") {
        isConnected = true; 
      }
      loading = false;
    };
  }
</script>

<main>
  <h1>My Svelte App</h1>
  <p>This app has custom authentication built on top of MongoDB</p>
  <hr />
  {#if form?.error}
    <p style="color:red;">{form.error}</p>
  {:else}
    {#if !isConnected}
      <form method="POST" use:enhance={handleSubmit}>
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <button formaction="?/login" disabled={loading}>{loading ? "Loading..." : "Log in"}</button>
        <button formaction="?/register" disabled={loading}>{loading ? "Loading..." : "Register"}</button>
      </form>
    {:else}
      <p>Go look at the <a href="/projects">projects</a></p>
    {/if}
  {/if}
</main>
