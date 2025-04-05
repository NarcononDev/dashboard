import PocketBase from 'pocketbase';

import { writable } from 'svelte/store';

export const pb = new PocketBase('https://dashboard.sbcdevsite.org');

export const currentUser = writable(pb.authStore.record);

pb.authStore.onChange(() => {
  currentUser.set(pb.authStore.record);
});