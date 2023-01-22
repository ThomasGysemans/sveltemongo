<script lang="ts">
  import type { PageData } from "./$types";
	import { enhance, type SubmitFunction } from "$app/forms";
	import imageChunksToURL from "$lib/imageChunksToURL";
  
  export let data: PageData; // the data returned by the `load` function of `./+page.server.ts`

  let loading = false; // sending the data can take a few seconds with slow internet connection
  let pictureURL: string | undefined; // the generated URL for the preview of the imported file, once the form submitted.
  
  const handleSubmit: SubmitFunction = ({data}) => {
    loading = true;

    return async ({result, update}) => {
      await update();
      if (result.type === "success") {
        // Once the image is uploaded successfully,
        // we want to show it immediately to the user.
        // Use an `onChange` event listener on the file input
        // to handle that as soon as an image is imported if you want a better preview.
        const file = data.get("picture") as File;
        if (file) {
          pictureURL = URL.createObjectURL(file);
        }
      }
      loading = false;
    };
  };

  // Send the raw data of big pictures can slow down your website.
  // Therefore, we're only received the Object ID so that we know where to find.
  // Fetching the data on the client side is great for performance.
  // Indeed, displaying a loading animation for a big file is no big deal.
  async function fetchPictureRawData() {
    const res = await fetch("/api/fetchImage", {
      method: "POST",
      body: JSON.stringify({
        fileId: data.user.picture,
      }),
    });

    if (res.ok) {
      return imageChunksToURL(await res.json());
    } else {
      throw new Error(await res.text());
    }
  }
</script>

<main>
  <a href="/projects">See your projects</a>
  <h1>This is my profile</h1>
  <p>Your email is {data.user.email}</p>
  <div class="container-picture">
    {#if pictureURL != undefined}
      <img src={pictureURL} alt="avatar" />
    {:else if data.user.picture != undefined}
      {#await fetchPictureRawData()}
        <span>Loading...</span>
      {:then res}
        <img src={res} alt="avatar" />
      {:catch}
        <span>Error</span>
      {/await}
    {:else}
      <span>No picture</span>
    {/if}
  </div>
</main>
<hr />
<form method="POST" action="/profile?/upload" use:enhance={handleSubmit}>
  <fieldset>
    <legend>Upload your profile picture</legend>
    <input name="picture" type="file" accept="image/png, image/jpeg" />
    <button disabled={loading}>{loading ? "Loading..." : "Submit"}</button>
  </fieldset>
</form>

<style>
  main .container-picture {
    border: 1px solid grey;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    display: flex;
    overflow: hidden;
  }

  main .container-picture > span {
    margin: auto;
  }

  main img {
    width: 100%;
    object-fit: cover;
  }
</style>