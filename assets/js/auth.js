if (jwt_auth) window.location.href = "/";

var googleUser = {};
var startApp = function() {
  gapi.load('auth2', function() {
    auth2 = gapi.auth2.init({
      client_id: '191344389936-gus0astcrgrq9rbp62a9q6018b61tm89.apps.googleusercontent.com',
      cookiepolicy: 'single_host_origin'
    });
    attachSignin(document.getElementById('google_login'));
  })
}

function attachSignin(element) {
  console.log(element.id);
  auth2.attachClickHandler(element, {},
    async function(googleUser) {
      // make call to login endpoint
      // Sign in info: googleUser.getAuthResponse().id_token;
      var result = await request("post", "/oauth/v1/login", {token: googleUser.getAuthResponse().id_token});
      console.log(result);
      if (result.jwt) {
        console.log("success"); // Do something here
        jwt_auth = result.jwt;
        window.location.href = "/";
      } else {
        console.log(result.message);
      }
    }, function(error) {
      // display error
    }
  )
}

startApp();
