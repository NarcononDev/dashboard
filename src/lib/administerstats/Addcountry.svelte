<script lang="ts">
  import { pb } from "../pocketbase";
	
  let name = $state('');
  let abbreviation = $state('');
  let isoCode2 = $state('');
  let isoCode3 = $state('');
  let response = $state({ 
    status: null, 
    message: null
  });

  async function addCountry(e) {
    response.status = null;
    response.message = null;
    e.preventDefault();
    const data = {
      "name": name,
      "abbreviation": abbreviation,
      "iso_2": isoCode2,
      "iso_3": isoCode3,
    };
    const newCountry = await pb.collection('Country').create(data);
    if(newCountry?.id != "" && newCountry?.id != null && newCountry?.id != undefined)
    {
      response.status = "success"
      response.message = "Country Added!"      
    } else {
      response.status = "error"
      response.message = "Please check the data you entered"
    }

  }
</script>

<h2 class="text-center">Add Organization</h2>
<form class="flex flex-col w-50 m-0-auto">
  <label class="flex flex-col my-1-2">Country Name:
    <input type="text" class="p-1-2" bind:value={name} />
  </label>
  <label class="flex flex-col my-1-2">Country Abbreviation:
    <input type="text" class="p-1-2" bind:value={abbreviation} />
  </label>  
  <label class="flex flex-col my-1-2">ISO 2 code (i.e. "CH" for Switzerland or "TW" for Taiwan):
    <input type="text" class="p-1-2" bind:value={isoCode2} />
  </label>  
  <label class="flex flex-col my-1-2">ISO 3 code (i.e. "CHE" for Switzerland or "TWN" for Taiwan)
    <input type="text" class="p-1-2" bind:value={isoCode3} />
  </label>  
  <button 
    onclick={(e) => addCountry(e)}
    type="submit" class="p-1-2 my-1-2 pointer">Add Organization</button>
  {#if response.status === "success"}
    <div>{response.message}</div>
  {/if}
  {#if response.status === "error"}
    <div>{response.message}</div>
  {/if}
</form>