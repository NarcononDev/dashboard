<script lang="ts">
import { onMount, onDestroy } from 'svelte';
import { currentUser, pb } from './pocketbase';
import Addstatistics from './administerstats/Addstatistics.svelte';
import Addorganization from './administerstats/Addorganization.svelte';
import Editstatistics from './administerstats/Editstatistics.svelte';
import Editorganizations from './administerstats/Editorganizations.svelte';
import Addcountry from './administerstats/Addcountry.svelte';
let currentView = $state('addorganizations');
let entities = $state([]);
let countries = $state([]);
let continents = $state([]);
function changeView(view) {
  currentView = view
}
onMount(async () => {
  const entityList = await pb.collection('Entity').getList(1, 50, {});
  entities = entityList.items
  const countryList = await pb.collection('Country').getList(1, 50, {});
  countries = countryList.items
  const continentList = await pb.collection('Continent').getList(1, 50, {});
  continents = continentList.items
})
</script>

<div>
  <div class="flex justify-end">
    <button class="p-1 m-1 pointer"
      onclick={() => changeView('addorganizations')}
    >Add Organizations</button>
    <button class="p-1 m-1 pointer"
      onclick={() => changeView('editorganizations')}
    >Edit Organizations</button>
    <button class="p-1 m-1 pointer"
      onclick={() => changeView('addstatistics')}
    >Add Statistics</button>
    <button class="p-1 m-1 pointer"
      onclick={() => changeView('editstatistics')}
    >Edit Statistics</button>
    <button class="p-1 m-1 pointer"
      onclick={() => changeView('addcountry')}
    >Add Country</button>
  </div>
<!-- Edit-->
{#if currentView === 'addorganizations'}
  <Addorganization {entities} {countries} {continents} />
{/if}
{#if currentView === 'editorganizations'}
  <Editorganizations {entities} {countries} {continents} />
{/if}
{#if currentView === 'addstatistics'}
  <Addstatistics {entities} />
{/if}
{#if currentView === 'editstatistics'}
  <Editstatistics {entities} />
{/if}
{#if currentView === 'addcountry'}
  <Addcountry />
{/if}
</div>