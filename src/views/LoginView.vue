<script>
import axios from "axios";
export default {
  data() {
    return {
      login: '',
      passwd: '',
      users: []
    };
  },
  methods: {
    async LoginUser() {
      try {
        const user = await axios.post(
          "https://mystage.interserver.net/apiv2/login",
          {
            login: this.login,
            passwd: this.passwd
          },
          {
            headers: { 'crossDomain': true },
        }
        );

        console.log(user)
      } catch(e) {
        console.log(e);
      }
    },
    async getUsers() {
      try {
        const users = await axios.get(
          "https://jsonplaceholder.typicode.com/users"
        );

        this.users = users.data;
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<template>
<div class="user-add">
  <h2>User Login</h2>
  <input type="text" v-model="login" name="login" id="login"/> <br />
  <input type="password" v-model="passwd" name="passwd" id="passwd"/> <br />

  <button @click="LoginUser">Login</button>
</div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
