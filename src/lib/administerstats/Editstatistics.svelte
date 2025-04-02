<script lang="ts">
  import { pb } from "../pocketbase";
  import { onMount, onDestroy } from 'svelte';
	
  let { entities } = $props();

  let statistics = $state([])
  let statistic = $state('')
  let selectedStatistic = $state({})
  let response = $state({
    status: null,
    message: null
  })
  async function editStatistic(e) {
    response.status = null;
    response.message = null;
    e.preventDefault();
    // example update data
    const data = {
      "name": selectedStatistic.name,
      "description": selectedStatistic.description,
      "entity": [
          selectedStatistic.entity
      ],
      "abbreviation": selectedStatistic.abbreviation,
      "division": selectedStatistic.division
    };
    const updateStatistic = await pb.collection('Statistics').update(selectedStatistic.id, data);
    console.log(updateStatistic)
    if(updateStatistic?.id != "" && updateStatistic?.id != null && updateStatistic?.id != undefined)
    {
      response.status = "success"
      response.message = "Statistic updated!"
    } else {
      response.status = "error"
      response.message = "Please check the data you entered"
    }
  }
  function selectStatistic(e) {
    for(let i = 0; i < statistics.length; i++) {
      if (statistics[i].id === e.target.value ) {
        selectedStatistic = statistics[i];
        selectedStatistic.entity = statistics[i].entity[0]
        return;
      }
    }
  }
  function selectEntity(e) {
    selectedStatistic.entity = e.target.value;
  }
  onMount(async () => {
    const statisticsList = await pb.collection('Statistics').getList(1, 50, {
      sort: 'entity',
    });
    statistics = statisticsList.items
  })
</script>

<h2 class="text-center">Edit Statistic</h2>

<label class="flex flex-col w-50 m-0-auto">Select Statistic to Edit:
  <select
  class="p-1-2" 
  bind:value={statistic}
  onchange={(e) => selectStatistic(e)}
  >
  {#each statistics as statistic }
    <option value={statistic.id}>{statistic.name}</option>
  {/each}
</select></label>

{#if selectedStatistic?.id != "" && selectedStatistic?.id != null && selectedStatistic?.id != undefined }
<form class="flex flex-col w-50 m-0-auto">
  <label class="flex flex-col my-1-2">Stat Name:
    <input class="p-1-2" bind:value={selectedStatistic.name} />
  </label>
  <label class="flex flex-col my-1-2">Stat Abbreviation:
    <input class="p-1-2" bind:value={selectedStatistic.abbreviation} />
  </label>
  <label class="flex flex-col my-1-2">Division:
    <input class="p-1-2" bind:value={selectedStatistic.division} />
  </label>
  <label class="flex flex-col my-1-2">Description:
    <textarea class="p-1-2" bind:value={selectedStatistic.description}></textarea>
  </label>
  <label class="flex flex-col my-1-2">Entity:
    <select
    class="p-1-2" 
    bind:value={selectedStatistic.entity}
    onchange={(e) => selectEntity(e)}
    > <!-- Get Entities-->
    {#each entities as entity }
      <option value={entity.id}>{entity.name}</option>
    {/each}
  </select></label>
  <button 
    onclick={(e) => editStatistic(e)}
    type="submit" class="p-1-2 my-1-2 pointer">Edit Stat</button>
  {#if response.status === "success"}
    <div>{response.message}</div>
  {/if}
  {#if response.status === "error"}
    <div>{response.message}</div>
  {/if}
</form>
{/if}