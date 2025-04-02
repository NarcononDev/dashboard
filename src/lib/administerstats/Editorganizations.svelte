<script lang="ts">
  import { pb } from "../pocketbase";
	
  let { entities, countries, continents } = $props();

  let organizations = $state([])
  let organization = $state('')
  let entity = $state('')

  let selectedOrganization = $state({})
  let response = $state({
    status: null,
    message: null
  })
  async function editOrganization(e) {
    response.status = null;
    response.message = null;
    e.preventDefault();
    // example update data
    const data = {
      "name": selectedOrganization.name,
      "address_street": selectedOrganization.address_street,
      "address_country": "RELATION_RECORD_ID",
      "address_city": selectedOrganization.address_city,
      "continent": selectedOrganization.continent,
      "entity": selectedOrganization.entity,
      "address_state": selectedOrganization.address_state,
      "abbreviation": selectedOrganization.abbreviation
    };
    const updateOrganization = await pb.collection('Organization').update(selectedOrganization.id, data);
    if(updateOrganization?.id != "" && updateOrganization?.id != null && updateOrganization?.id != undefined)
    {
      response.status = "success"
      response.message = "Statistic updated!"
    } else {
      response.status = "error"
      response.message = "Please check the data you entered"
    }
  }
  function selectOrganization(e) {
    for(let i = 0; i < organizations.length; i++) {
      if (organizations[i].id === e.target.value ) {
        selectedOrganization = organizations[i];
        selectedOrganization.entity = organizations[i].entity
        return;
      }
    }
  }
  async function selectEntityForOrganization(e) {
    getOrganizations(e.target.value);
  }

  async function getOrganizations(entityId) {
    const organizationsList = await pb.collection('organizations').getList(1, 50, {
      filter: `entity.id="${entityId}"`,
    });
    organizations = organizationsList.items
    console.log(organizations)
  }
  function selectEntity(e) {
    selectedOrganization.entity = e.target.value;
  }
  function selectCountry(e) {
    selectedOrganization.country = e.target.value;
  }
</script>

<h2 class="text-center">Edit Organization</h2>

<label class="flex flex-col w-50 m-0-auto">Select Entity:
  <select
  class="p-1-2" 
  bind:value={entity}
  onchange={(e) => selectEntityForOrganization(e)}
  >
  {#each entities as entity }
    <option value={entity.id}>{entity.name}</option>
  {/each}
</select></label>
<label class="flex flex-col w-50 m-0-auto">Select Organization to Edit:
  <select
  class="p-1-2" 
  bind:value={organization}
  onchange={(e) => selectOrganization(e)}
  >
  <option>Select entity first</option>
  {#each organizations as organization }
    <option value={organization.id}>{organization.name}</option>
  {/each}
</select></label>

{#if selectedOrganization?.id != "" && selectedOrganization?.id != null && selectedOrganization?.id != undefined }
<form class="flex flex-col w-50 m-0-auto">
  <label class="flex flex-col my-1-2">Organization Name:
    <input type="text" class="p-1-2" bind:value={selectedOrganization.name} />
  </label>
  <label class="flex flex-col my-1-2">Name Abbreviation:
    <input type="text" class="p-1-2" bind:value={selectedOrganization.abbreviation} />
  </label>  
  <label class="flex flex-col my-1-2">Street Address:
    <input type="text" class="p-1-2" bind:value={selectedOrganization.address_street} />
  </label>  
  <label class="flex flex-col my-1-2">City:
    <input type="text" class="p-1-2" bind:value={selectedOrganization.address_city} />
  </label>  
  <label class="flex flex-col my-1-2">State:
    <input type="text" class="p-1-2" bind:value={selectedOrganization.address_state} />
  </label>  
  <label class="flex flex-col my-1-2">Country:
    <select
    class="p-1-2" 
    bind:value={selectedOrganization.address_country}
    onchange={(e) => selectCountry(e)}
    >
    {#each countries as country }
      <option value={country.id}>{country.name}</option>
    {/each}
  </select></label>
  <label class="flex flex-col my-1-2">Continent:
    <select
    class="p-1-2" 
    bind:value={selectedOrganization.continent}
    > <!-- Get Entities-->
    {#each continents as continent }
      <option value={continent.id}>{continent.name}</option>
    {/each}
  </select></label>
  <label class="flex flex-col my-1-2">Entity:
    <select
    class="p-1-2" 
    bind:value={selectedOrganization.entity}
    onchange={(e) => selectEntity(e)}
    >
    {#each entities as entity }
      <option value={entity.id}>{entity.name}</option>
    {/each}
  </select></label>
  <button 
    onclick={(e) => editOrganization(e)}
    type="submit" class="p-1-2 my-1-2 pointer">Edit Organization</button>
  {#if response.status === "success"}
    <div>{response.message}</div>
  {/if}
  {#if response.status === "error"}
    <div>{response.message}</div>
  {/if}
</form>
{/if}