<script lang="ts">
  import { pb } from "../pocketbase";
	
  let { entities, countries, continents } = $props();

  let name = $state('');
  let abbreviation = $state('');
  let streetAddress = $state('');
  let city = $state('');
  let state = $state('');
  let country = $state('');
  let continent = $state('');
  let entity = $state('');
  let response = $state({status: null, message: null });
  

  async function addOrganization(e) {
    response.status = null;
    response.message = null;
    e.preventDefault();
    const data = {
      "name": name,
      "address_street": streetAddress,
      "address_country": country,
      "address_city": city,
      "continent": continent,
      "entity": entity,
      "address_state": state,
      "abbreviation": abbreviation
    };
    const newOrganization = await pb.collection('Organizations').create(data);
    if(newOrganization?.id != "" && newOrganization?.id != null && newOrganization?.id != undefined)
    {
      response.status = "success"
      response.message = "Organization added!"
      name = ''
      abbreviation = ''
      streetAddress = ''
      city = ''
      state = ''
      country = ''
      entity = ''
      continent = ''
    } else {
      response.status = "error"
      response.message = "Please check the data you entered"
    }

  }
</script>

<h2 class="text-center">Add Organization</h2>
<form class="flex flex-col w-50 m-0-auto">
  <label class="flex flex-col my-1-2">Organization Name:
    <input type="text" class="p-1-2" bind:value={name} />
  </label>
  <label class="flex flex-col my-1-2">Name Abbreviation:
    <input type="text" class="p-1-2" bind:value={abbreviation} />
  </label>  
  <label class="flex flex-col my-1-2">Street Address:
    <input type="text" class="p-1-2" bind:value={streetAddress} />
  </label>  
  <label class="flex flex-col my-1-2">City:
    <input type="text" class="p-1-2" bind:value={city} />
  </label>  
  <label class="flex flex-col my-1-2">State:
    <input type="text" class="p-1-2" bind:value={state} />
  </label>  
  <label class="flex flex-col my-1-2">Country:
    <select
    class="p-1-2" 
    bind:value={country}
    > <!-- Get Entities-->
    {#each countries as country }
      <option value={country.id}>{country.name}</option>
    {/each}
  </select></label>
  <label class="flex flex-col my-1-2">Continent:
    <select
    class="p-1-2" 
    bind:value={continent}
    >
    {#each continents as continent }
      <option value={continent.id}>{continent.name}</option>
    {/each}
  </select></label>
  <label class="flex flex-col my-1-2">Entity:
    <select
    class="p-1-2" 
    bind:value={entity}
    > <!-- Get Entities-->
    {#each entities as entity }
      <option value={entity.id}>{entity.name}</option>
    {/each}
  </select></label>
  <button 
    onclick={(e) => addOrganization(e)}
    type="submit" class="p-1-2 my-1-2 pointer">Add Organization</button>
  {#if response.status === "success"}
    <div>{response.message}</div>
  {/if}
  {#if response.status === "error"}
    <div>{response.message}</div>
  {/if}
</form>