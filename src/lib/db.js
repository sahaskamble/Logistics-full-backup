import { PB_URL } from '@/constants/url';
import PocketBase from 'pocketbase';

const pbclient = new PocketBase(PB_URL);

// pbclient.authStore((e) => {
//   console.log("Action", e);
//   console.log("User Details", pbclient.authStore.record);
//   console.log("is User Authenticated", pbclient.authStore.isValid);
// })

export default pbclient;
