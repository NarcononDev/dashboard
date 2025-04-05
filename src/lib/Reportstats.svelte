<script lang="ts">
    import { onMount } from 'svelte';
    import { currentUser, pb } from './pocketbase';

    let weekEnding = $state({});
    let weekEndingList = $state([]);

    let organizations = $state([]);
    let statisticFigures = $state([]);
    let statistics = $state([]);
    let currentView = $state('organizations');

    let entityId = $state('');
    let organizationId = $state('');

    let attestIsDone = $state(false);
    let response = $state({ status: null, message: null });

    let debouncedSaveItem; // Declare debouncedSaveItem outside the function

    function changeView(view, entity, organization) {
      currentView = view;
      entityId = entity;
      organizationId = organization
      if(view === 'input') {
        loadStats();
      }
    }

    function selectWeekEnding(e) {
      for(let i = 0; i < weekEndingList.length; i++) {
        if(e.target.value == weekEndingList[i].id) {
          weekEnding = weekEndingList[i];
          loadStats();
          break;
        }
      }
    }

    async function submitStatReport(e) {
      e.preventDefault();
      response.status = "success";
      response.message = "Thank you for sending your statistics!";
      if(attestIsDone) {
        const data = {
            "confirmed": attestIsDone
        };
        for(let i = 0; i < statisticFigures.length; i++) {
          const record = await pb.collection('Statistic_Figures').update(statisticFigures[i].id, data);
          if(!record.id) {
            response.status = "error";
            response.message = "Please check your report, we had an error in saving"
          }
        }
      } else {
        response.status = "error";
        response.message = "Please confirm your stats are complete"
      }
    }

    async function saveItem(e) {
      const data = {
        "value": e.target.value,
      };
      const record = await pb.collection('Statistic_Figures').update(id, data);
    }

    async function loadStats() {
      const statisticsList = await pb.collection('Statistics').getList(1, 50, {
          filter: `entity.id="${entityId}"`
        });
        statistics = statisticsList.items;

        const statisticsFiguresList = await pb.collection('Statistic_Figures').getList(1, 50, {
          filter: `week_ending_date.id="${weekEnding.id}" && organization.id="${organizationId}"`,
          expand: 'statistic',
        });
        statisticFigures = sortArray(statisticsFiguresList.items);

        if (statistics.length == statisticFigures.length) {
          return;
        }
        for (let i = 0; i < statistics.length; i++) {
          const stat = statistics[i]
          let foundMatch = false;

          for (let j = 0; j < statisticFigures.length; j++) {
            if(statisticFigures[j].expand.statistic.id === stat.id) {
              foundMatch = true;
              break;
            }
          }
          if (!foundMatch) {
            const data = {
              "statistic": stat.id,
              "organization": organizationId,
              "week_ending_date": weekEnding.id
            };
            const createStatFigure = await pb.collection('Statistic_Figures').create(data);
          }
        }
        const statisticsFiguresListNew = await pb.collection('Statistic_Figures').getList(1, 50, {
          filter: `week_ending_date.id="${weekEnding.id}" && organization.id="${organizationId}"`,
          expand: 'statistic',
        });
        statisticFigures = sortArray(statisticsFiguresListNew.items);
    }

    
    function handleInputChange(e, id) {
      if (!debouncedSaveItem) {
        debouncedSaveItem = debounce(saveItem, 100); // Create it only once
      }
      debouncedSaveItem(e, id); // Call the debounced function
    }

    function debounce(func, delay) {
      let timeout=null
      return (...args) => {
        if(timeout) clearTimeout(timeout)

        timeout=setTimeout(() => {
            func(...args)
            timeout=null
        }, delay)
      }
    } 

    function sortArray(array) {
      array.sort((a, b) => {
        if (a.expand.statistic.division > b.expand.statistic.division) return 1;
        if (a.expand.statistic.division < b.expand.statistic.division) return -1;
        return 0;
      });
      return array
    }

    async function weekEndingCalc() {
      let d = new Date();
      d.setDate(d.getDate() + (4 + 7 - d.getDay()) % 7);
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      const thursday = d.toISOString().slice(0, 10);
      return thursday;
    }

    onMount(async () => {
      const thursday = await weekEndingCalc();
      try {
        const weekending = await pb.collection('Week_ending_date').getFirstListItem(`date="${thursday}"`);
        weekEnding = weekending;
      } catch {
        const weekending = await pb.collection('Week_ending_date').create({ "date": thursday })
        weekEnding = weekending;
      }
      const allWeekEndings = await pb.collection('Week_ending_date').getList(1, 50, {
        sort: `-date`
      });
      weekEndingList = allWeekEndings.items;
      const organizationList = await pb.collection('Organizations').getList(1, 50, {
        filter: `users.id="${$currentUser.id}"`, 
        expand: 'address_country, entity'
      });
      organizations = organizationList.items;
    })
</script>

{#if currentView === 'organizations'}
  <div class="organizations">
    {#each organizations as organization }
      <section class="flex flex-col">
        <button onclick={() => changeView('input', organization.expand.entity.id, organization.id)} class="p-1 m-1 pointer"><h4>{organization.name}</h4></button>
      </section>
    {/each}
  </div>
{:else if currentView === 'input'}
  <div class="flex justify-between">
    <div class="flex align-items-center gap-1">
    Week Ending:
      <select 
        onchange={(e) => selectWeekEnding(e)}>
      {#each weekEndingList as we} 
        <option value={we.id}>{we.date}</option>
      {/each}
      </select>
    </div>
    <button 
    class="pointer p-1 background-unset border-unset btn-hover-typ"
    onclick={() => changeView('organizations', null, null)}>Return to: Organizations</button>
  </div>
  <table class="table-standard vertical">
    <thead>
      <tr>
        <th>Div</th>
        <th>Name</th>
        <th>Abbreviation</th>
        <th>Value</th>
        <th></th>
        <th>Description</th>
      <tr>
    </thead>
    <tbody>
    {#each statisticFigures as statFig (statFig.id)}
    <tr>
      <td class="nowrap">{statFig.expand.statistic.division}</td>
      <td class="nowrap">{statFig.expand.statistic.name}</td>
      <td class="nowrap">{statFig.expand.statistic.abbreviation}</td>
      <td>
      <input 
        oninput={(e) => handleInputChange(e, statFig.id)}
        type="number" class="p-1" value={statFig.value} disabled={statFig.confirmed}/>
      </td>
      <td>
      {#if !statFig.confirmed}
        <div></div>
      {:else}
        <img class="stat-confirmed-svg" alt="Check mark" src="/svgs/check-mark.svg" />
      {/if}
      </td>
      <td><div>{statFig.expand.statistic.description}</div></td>
    </tr>
    {/each}
    <tr>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td><label>I attest this is complete
        <input bind:checked={attestIsDone} type="checkbox" />
      </label>
      {#if attestIsDone}
      <button onclick={(e) => submitStatReport(e)} class="pointer border-unset background-unset p-1 ml-1 btn-hover-typ">Submit</button>
      {/if}
    </td>
    </tr>
    </tbody>
  </table>
  {#if response.status === "success"}
    <div>{response.message}</div>
  {/if}
  {#if response.status === "error"}
    <div>{response.message}</div>
  {/if}
{/if}