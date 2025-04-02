<script lang="ts">
  import { pb } from "../pocketbase";
	
  let { entities } = $props();
  let statName = $state('');
  let statAbbreviation = $state('');
  let division = $state('');
  let description = $state('');
  let entity = $state('');
  let response = $state({status: null, message: null });

  async function addStatistic(e) {
    response.status = null;
    response.message = null;
    e.preventDefault();
    const data = {
      "name": statName,
      "abbreviation": statAbbreviation,
      "division": division,
      "description": description,
      "entity": [entity]
    }
    const newStatistic = await pb.collection('Statistics').create(data);
    if(newStatistic?.id != "" && newStatistic?.id != null && newStatistic?.id != undefined)
    {
      response.status = "success"
      response.message = "Statistic added!"
    } else {
      response.status = "error"
      response.message = "Please check the data you entered"
    }

  }
</script>

<h2 class="text-center">Add Statistic</h2>
<form class="flex flex-col w-50 m-0-auto">
  <label class="flex flex-col my-1-2">Stat Name:
    <input class="p-1-2" bind:value={statName} />
  </label>
  <label class="flex flex-col my-1-2">Stat Abbreviation:
    <input class="p-1-2" bind:value={statAbbreviation} />
  </label>
  <label class="flex flex-col my-1-2">Division:
    <input class="p-1-2" bind:value={division} />
  </label>
  <label class="flex flex-col my-1-2">Description:
    <textarea class="p-1-2" bind:value={description}></textarea>
  </label>
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
    onclick={(e) => addStatistic(e)}
    type="submit" class="p-1-2 my-1-2 pointer">Add Stat</button>
  {#if response.status === "success"}
    <div>{response.message}</div>
  {/if}
  {#if response.status === "error"}
    <div>{response.message}</div>
  {/if}
</form>