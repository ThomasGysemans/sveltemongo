<script lang="ts">
	import type { PageData } from "./$types";
	import { goto } from "$app/navigation";
  
  export let data: PageData;
  $: ({projects, user} = data);

  let loading = false;

  async function logOut() {
    loading = true;

    const response = await fetch("/api/logOut", {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    loading = false;

    if (response.status === 200) {
      goto("/");
    }
  }
</script>

<div>
  <h1>Hello</h1>
  <p>Connected with email {user.email}</p>
  <p><a href="/profile">See your profile</a></p>
  <hr />
  {#if projects != null}
    {#each projects as project}
      <h2>Titre du projet : {project.title}</h2>
    {/each}
  {/if}
</div>

<button on:click={logOut} disabled={loading}>{loading ? "Loading..." : "Log out"}</button>