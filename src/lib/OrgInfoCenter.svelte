<script lang="ts">
  import { onMount } from 'svelte';
  import { currentUser, pb } from './pocketbase';
  import {Chart} from 'chart.js'

  let organizations = $state([]);
  let selectedOrganization = $state({});
  let statistics = $state([]);
  let selectedStatistic = $state('');
  let currentView = $state('organizations')
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
    <button class="p-1 m-1 pointer">
      {stat.name}
    </button>
  {/each}
</div>
{/if}
