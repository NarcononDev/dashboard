<script lang="ts">
  import { pb } from './pocketbase';

  let name = $state('');
  let password = $state('');
  let email = $state('');

  let currentView = $state('login');
  let response = $state({
    status: null, 
    message: null
  })

  function changeView(newView) {
    currentView = newView;
  }

  async function login(e) {
    e.preventDefault();
    try {
      const login = await pb.collection('users').authWithPassword(email, password);
    } catch (err) {
      response.status = "error"
      response.message = "Please try again"
    }
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
      response.status = "error"
      response.message = "Please try again"
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
    {#if response.status === "success"}
    <div>{response.message}</div>
    {/if}
    {#if response.status === "error"}
      <div>{response.message}</div>
    {/if}
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
    {#if response.status === "success"}
      <div>{response.message}</div>
    {/if}
    {#if response.status === "error"}
      <div>{response.message}</div>
    {/if}
  </form>
  {/if}
</div>