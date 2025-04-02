<script lang="ts">
  import { onMount } from 'svelte';
  import { pb } from './pocketbase';
  
  let weekEnding = $state({});

  let entities = $state([]);
  let organizations = $state([]);
  let selectedEntity = $state('');  
  let statisticFigures = $state([]);
  let statistics = $state([]);

  onMount(async () => {
    const entityList = await pb.collection('Entity').getList(1, 50, {});
    entities = entityList.items
    let d = new Date();
      d.setDate(d.getDate() + (4 + 7 - d.getDay()) % 7);
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      const thursday = d.toISOString().slice(0, 10);
      try {
        const weekending = await pb.collection('Week_ending_date').getFirstListItem(`date="${thursday}"`);
        weekEnding = weekending;
      } catch {
        const date = { "date": thursday }
        const weekending = await pb.collection('Week_ending_date').create(date)
        weekEnding = weekending;
      }
  })
  async function getOrganizations(e) {
    selectedEntity = e.target.value
    const organizationList = await pb.collection('Organizations').getList(1, 50, {
      filter: `entity.id="${selectedEntity}"`
    });
    organizations = organizationList.items;
    if(organizations.length > 0 && weekEnding?.id != "") {
      getStatReport();
    }
  }
  async function getStatReport() {
    let isDone = false
    let queryString = `week_ending_date.id="${weekEnding.id}"&&confirmed=true`;
    for(let i = 0; i < organizations.length; i++ ) {
      if(!organizations.id) {
        break;
      }
      queryString = queryString + "&&" + `organizations.id="${organizations[i].id}"`
    }
    const statFigsList = await pb.collection('Statistic_Figures').getList(1, 50, {
      filter: queryString,
      expand: "statistic"
    })
    statisticFigures = statFigsList.items;
    
  };
  function createDateForExport() {
    let weekEndingString = '';
    let weekEndingArray = weekEnding.date.split("-")
    weekEndingArray = weekEndingArray.reverse();
    for(let i = 0; i < weekEndingArray.length; i++) {
      if((i + 1) == weekEndingArray.length) {
        weekEndingString = weekEndingString + weekEndingArray[i]
        break;
      }
      weekEndingString = weekEndingString + weekEndingArray[i] + "."
    }
    return weekEndingString
  }
  function createOrgStatsForExport(orgArray, orgCode) {
    let masterString = '';
    let weekEnding = `/WE:${createDateForExport()}`;
    let orgId = `/ORG:${orgCode}`
    masterString = masterString + weekEnding + orgId;
    for(let i = 0; i < orgArray.length; i++ ) {
      const statReport = `/${orgArray[i].expand.statistic.abbreviation}:${orgArray[i].value}`
      masterString = masterString + statReport
    }
    return masterString
  }
  function createDataForExport() {
    let masterString = ''; 
    let statFigs = $state.snapshot(statisticFigures);
    for(let i = 0; i < organizations.length; i++) {
      const orgStatFigs = statFigs.filter((statFig) => statFig.organization == organizations[i].id);
      const thisOrgsReport = createOrgStatsForExport(orgStatFigs, organizations[i].abbreviation)
      masterString = masterString + thisOrgsReport + '/*'
    }
    return masterString
  }

  function createAndDownloadTextFile() {
    const masterString = createDataForExport();
    const blob = new Blob([masterString], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "StatExport.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
</script>

<div class="pl-2 pr-2">
  <label class="flex flex-col my-1-2">Select Entity:
    <select
    class="p-1-2" 
    value={selectedEntity}
    onchange={(e) => getOrganizations(e)}
    >
    {#each entities as entity }
      <option value={entity.id}>{entity.name}</option>
    {/each}
  </select></label>
  <div class="flex flex-col my-1">
    Week Ending: {weekEnding.date} 
  </div>
</div>
{#if organizations.length != 0}
  <table class="table-standard">
    <thead>
      <tr>
        <th>Organization</th>
        {#each statisticFigures.filter((obj, index, self) => index === self.findIndex((o) => (o.expand.statistic.id === obj.expand.statistic.id))) as statFig}
          <td>{statFig.expand.statistic.name}</td>
        {/each}
      </tr>
    </thead>
    <tbody>
    {#each organizations as org }
      <tr>
        <td>{org.name}</td>
        {#each statisticFigures.filter(statisticFigure => statisticFigure.organization === org.id) as statFig}
          <td>{statFig.value}</td>
        {/each}
      </tr>
    {/each}
    </tbody>
  </table>
  <div class="p-2">
    <button class="m-2 p-1 pointer" onclick={() => createAndDownloadTextFile()}>Export Stats</button>
  </div>
{:else}
  <div class="pl-2 pr-2">Select an entity with organizations</div>
{/if}