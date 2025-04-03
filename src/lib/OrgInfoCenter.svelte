<script lang="ts">
  import { onMount } from 'svelte';
  import { currentUser, pb } from './pocketbase';
  import Chart from 'chart.js/auto';

  let organizations = $state([]);
  let selectedOrganization = $state({});
  let statistics = $state([]);
  let selectedStatistic = $state('');
  let currentView = $state('organizations')
  
  let statGraphData = [];
  let statGraphLabels = [];
  let statGraph;
  
  async function changeView(isCurrentView, newView, data) {
    if(isCurrentView == 'organizations') {
      selectedOrganization = data;
    }
    if(newView == 'statpicker') {
      const resultList = await pb.collection('Statistics').getList(1, 50, {
        filter: `entity.id="${data.entity}"`,
      });
      statistics = resultList.items;
    }
    currentView = newView;
  }
  async function loadStat(statId, statName) {
    currentView = 'statdisplay'
    const statFigList = await pb.collection('Statistic_Figures').getList(1, 50, {
      filter: `statistic.id="${statId}" && organization.id="${selectedOrganization.id}"`, 
      expand: 'week_ending_date'
    });
    statFigList.items.sort((a, b) => {
      if (a.expand.week_ending_date.date > b.expand.week_ending_date.date) return 1;
      if (a.expand.week_ending_date.date < b.expand.week_ending_date.date) return -1;
      return 0;
    })
    for(let i = 0; i < statFigList.items.length; i++) {
      statGraphData.push(statFigList.items[i].value)
      statGraphLabels.push(statFigList.items[i].expand.week_ending_date.date)
    }
    const down = (ctx, value) => ctx.p0.parsed.y > ctx.p1.parsed.y ? value : undefined;
    let graphData = {
      labels: statGraphLabels,
      datasets: [{
        label: statName,
        borderColor: 'rgb(0, 0, 0)',
        segment: {
          borderColor: ctx => down(ctx, 'rgb(255,0,0)'),
        },
        data: statGraphData,
        fill: false
      }]
    };    
    let graphConfig = {
      type: 'line',
      data: graphData,
    };
    const ctx = statGraph.getContext('2d');  
    new Chart(ctx, graphConfig as any);
  }
  onMount(async () => {
    const organizationList = await pb.collection('Organizations').getList(1, 50, {
      filter: `users.id="${$currentUser.id}"`, 
      expand: 'address_country, entity'
    });
    organizations = organizationList.items;
    if(organizations.length > 1 ) {
      currentView = 'organizations';
      return;
    }
    currentView = 'stats';
  })
</script>

{#if currentView == 'organizations' }
<div class="pl-2 pr-2">
  {#each organizations as organization}
    <section class="flex flex-col">
      <button onclick={() => changeView('organizations', 'statpicker', organization)} class="p-1 m-1 pointer"><h4>{organization.name}</h4></button>
    </section>
  {/each}
</div>
{/if}
{#if currentView == 'statpicker' }
<div class="pl-2 pr-2">
  {#each statistics as stat}
    <button 
      onclick={() => loadStat(stat.id, stat.name)}
      class="p-1 m-1 pointer">
      {stat.name}
    </button>
  {/each}
</div>
{/if}
{#if currentView == 'statdisplay' }
  <div>
    <canvas bind:this={statGraph}></canvas>
  </div>
{/if}