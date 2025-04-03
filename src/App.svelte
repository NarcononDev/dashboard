<script lang="ts">
  import Login from "./lib/Login.svelte";
  import Statisticsform from "./lib/Statisticsform.svelte";
  import Administerstats from "./lib/Administerstats.svelte";
  import { currentUser, pb } from "./lib/pocketbase";
  import Statisticsroundup from "./lib/Statisticsroundup.svelte";
  import OrgInfoCenter from "./lib/OrgInfoCenter.svelte";
  let currentView = $state("statcable");

  let settingsIcon = $state(false);
  
  function signOut() {
    pb.authStore.clear();
  }

  function changeView(newView) {
    currentView = newView
  }
</script>

{#if !$currentUser}
<Login />
{:else}
<div class="grid grid-container h-100">
  <header class="grid-area-header flex align-items-center p-2">
    
    <nav class="breadcrumbs">
      <div class="breadcrumb-item">Dashboard</div>
      <div class="breadcrumb-item">
        {#if currentView === 'statcable'}
          Statistic Cable
        {/if}
        {#if currentView === 'informationcenter'}
          Information Center
        {/if}
        {#if currentView === 'admin'}
          Admin Panel
        {/if}
        {#if currentView === 'statreport'}
          Stats roundup
        {/if}
      </div>
    </nav>
    <div class="ml-auto">
      <button
        class="background-unset border-unset pointer"
        onclick={() => (settingsIcon = !settingsIcon)}
      >
        <img 
          class="control-icon" alt="settings" src="/svgs/gear.svg" 
        />
      </button>
    </div>
      {#if settingsIcon}
      <div class="flex">
        <div class="pr-1-2">Signed in as {$currentUser.name}</div>
        <button 
          class="pointer"
          onclick={signOut}>
          Sign Out
        </button>
      </div>
      {/if}
  </header>
  <aside class="grid-area-aside border-r-1-base pl-1 pr-1">
    <div class="p-2">Logo here</div>
    <nav class="tier-1-nav flex flex-col">
    <button 
      onclick={() => changeView("statcable")}
      class="m-1-2 background-unset border-unset p-1-2 pointer text-left">
      Stat Cable
    </button>
    <button 
      onclick={() => changeView("informationcenter")}
      class="m-1-2 background-unset border-unset p-1-2 pointer text-left">
      Information Centre
    </button>
    <button 
      onclick={() => changeView("admin")}
      class="m-1-2 background-unset border-unset p-1-2 pointer text-left">
      Administer Stats
    </button>
    <button 
      onclick={() => changeView("statreport")}
      class="m-1-2 background-unset border-unset p-1-2 pointer text-left">
      W/E Stat Report
    </button>
    </nav>
  </aside>
  <main class="grid-area-main overflow-auto">
    {#if currentView === "statcable"}
      <Statisticsform />
    {/if}
    {#if currentView === "informationcenter"}
      <OrgInfoCenter />
    {/if}
    {#if currentView === "admin"}
      <Administerstats />
    {/if}
    {#if currentView === "statreport"}
      <Statisticsroundup />
    {/if}
  </main>
  <footer class="grid-area-footer">
    Footer
  </footer>
</div>
{/if}