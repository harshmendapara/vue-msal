<template>
  <div id="app">
    <img src="./assets/logo.png" />
    <h1>{{ msg }}</h1>
    <button @click="login" type="button" v-if="!user">Login with Microsoft</button>
    <button @click="callAPI" type="button" v-if="user">Call Graph's /me API</button>
    <button @click="logout" type="button" v-if="user">Logout</button>
    <h3 v-if="user">Hello {{ user.name }}</h3>
    <pre v-if="userInfo">{{ JSON.stringify(userInfo, null, 4) }}</pre>
    <p v-if="loginFailed">Login unsuccessful</p>
    <p v-if="apiCallFailed">Graph API call unsuccessful</p>
  </div>
</template>

<script>
import AuthService from "./services/auth.service";
import GraphService from "./services/graph.service";
import * as Msal from "msal";

export default {
  name: "app",
  data() {
    return {
      user: null,
      userInfo: null,
      apiCallFailed: false,
      loginFailed: false,
    };
  },
  created() {
    this.authService = new AuthService();
    this.graphService = new GraphService();
  },
  methods: {
    callAPI() {
      this.apiCallFailed = false;
      this.authService.getToken().then(
        (token) => {
          this.graphService.getUserInfo(token).then(
            (data) => {
              this.userInfo = data;
            },
            (error) => {
              console.error(error);
              this.apiCallFailed = true;
            }
          );
        },
        (error) => {
          console.error(error);
          this.apiCallFailed = true;
        }
      );
    },

    logout() {
      this.authService.logout();
    },

    login() {
      console.log("sddsd");
      // if using cdn version, 'Msal' will be available in the global scope

      const msalConfig = {
        auth: {
          clientId: "a7718710-ac23-436d-8d4d-66ab2789ca07",
        },
      };

      const msalInstance = new Msal.UserAgentApplication(msalConfig);

      msalInstance.handleRedirectCallback((error, response) => {
        console.log(error);
        console.log(response);
        window.location.origin;
        // handle redirect response or error
      });
      var loginRequest = {
       scopes: ['user.read'] // optional Array<string>
   };

    msalInstance.loginPopup(loginRequest)
        .then(response => {
          console.log(response);
            // handle response
        })
        .catch(err => {
          console.log(err);
            // handle error
        });
      //   this.loginFailed = false;
      //   this.authService.login().then(
      //     user => {
      //       if (user) {
      //         this.user = user;
      //       } else {
      //         this.loginFailed = true;
      //       }
      //     },
      //     () => {
      //       this.loginFailed = true;
      //     }
      //   );
    },
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

button {
  margin: 15px;
}
</style>
