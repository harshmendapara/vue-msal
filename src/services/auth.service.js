import * as Msal from 'msal';

export default class AuthService {
  constructor() {
    let redirectUri = window.location.origin;
  
    this.applicationConfig = {
      clientID: 'a7718710-ac23-436d-8d4d-66ab2789ca07',
      graphScopes: ['user.read']
    };
    this.app = new Msal.UserAgentApplication(
      'a7718710-ac23-436d-8d4d-66ab2789ca07',
      '',
      (msf) => {
        console.log(msf)
        // callback for login redirect
      },
      {
        redirectUri
      }
    );
  }
  login() {
    return this.app.loginPopup(this.applicationConfig.graphScopes).then(
      () => {
        const user = this.app.getUser();
        if (user) {
          return user;
        } else {
          return null;
        }
      },
      () => {
        return null;
      }
    );
  }
  logout() {
    this.app.logout();
  }
  getToken() {
    return this.app.acquireTokenSilent(this.applicationConfig.graphScopes).then(
      accessToken => {
        return accessToken;
      },
      () => {
        return this.app
          .acquireTokenPopup(this.applicationConfig.graphScopes)
          .then(
            accessToken => {
              return accessToken;
            },
            err => {
              console.error(err);
            }
          );
      }
    );
  }
}
