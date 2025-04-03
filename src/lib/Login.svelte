<script lang="ts">
  import { pb } from './pocketbase';

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
<div class="wrapper wrapper-sm">
  {#if currentView === 'login'}
  <form class="">
    <div class="form-field required">
      <label for="email">
        Email
      </label>
      <input 
        type="email"
        id="email"
        bind:value={email}
      />
    </div>
    <div class="form-field required">
      <label for="password">
        Password
      </label>
      <input 
        type="password"
        id="password"
        bind:value={password}
      />
    </div>
    <button 
      class="btn btn-lg btn-block btn-next"
      onclick={(e) => login(e)}>Login
    </button>
    <button class="m-1" 
      onclick={() => changeView("signup")}>Do you need to signup?
    </button>
  </form>
  {/if}
  {#if currentView === 'signup'}
  <form class="wrapper wrapper-sm justify-center grid-area-all flex flex-col">
    <div class="form-field required">
      <label for="name">Name</label>
      <input 
        type="text"
        id="name"
        bind:value={name}
      />
    </div>
    <div class="form-field required">
      <label for="email">Email</label>
      <input 
        type="email"
        id="email"
        bind:value={email}
      />
    </div>
    <div class="form-field required">
      <label for="password">Password</label>
      <input 
        type="password"
        id="password"
        bind:value={password}
      />
    </div>
    <button 
      class="btn btn-lg btn-block btn-next"
      onclick={(e) => signUp(e)}>Sign Up
    </button>
    <button class="m-1" onclick={() => changeView("login")}>Do you need to login?</button>
  </form>
  {/if}
</div>