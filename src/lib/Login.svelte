<script lang="ts">
  import { currentUser, pb } from './pocketbase';

  let name: string;
  let password: string;
  let email: string;

  let currentView = 'login';

  function changeView(newView) {
    currentView = newView;
  }

  async function login(e) {
    e.preventDefault();
    await pb.collection('users').authWithPassword(email, password);
  }

  async function signUp(e) {
    e.preventDefault();
    try {
      const data = {
        password,
        "passwordConfirm": password, 
        email,
        "emailVisibility": false,
        name, 
      };
      const createdUser = await pb.collection('users').create(data);
      await login(e);
    } catch (err) {
      console.log(err)
    }
  }

</script>

  {#if currentView === 'login'}
  <form class="flex flex-col w-33 m-0-auto">
    <input 
      class="p-1 m-1"
      placeholder="Email"
      type="email"
      bind:value={email}
    />
    <input 
      class="p-1 m-1"
      placeholder="Password"
      type="password"
      bind:value={password}
    />
    <button 
      class="m-1 p-1"
      onclick={(e) => login(e)}>Login
    </button>
    <button class="m-1" 
      onclick={() => changeView("signup")}>Do you need to signup?
    </button>
  </form>
  {/if}
  {#if currentView === 'signup'}
  <form class="flex flex-col w-33 m-0-auto">
    <input 
      class="p-1 m-1"
      placeholder="Name"
      type="text"
      bind:value={name}
    />
    <input 
      class="p-1 m-1"
      placeholder="Email"
      type="email"
      bind:value={email}
    />
    <input 
      class="p-1 m-1"
      placeholder="Password"
      type="password"
      bind:value={password}
    />
    <button 
      class="m-1 p-1"
      onclick={(e) => signUp(e)}>Sign Up
    </button>
    <button class="m-1" onclick={() => changeView("login")}>Do you need to login?</button>
  </form>
  {/if}
