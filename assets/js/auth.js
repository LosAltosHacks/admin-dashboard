"use strict";
import { request } from "./helpers.js";
import * as jQuery from './jquery.min.js';
window.$ = $;
window.jQuery = jQuery;

// silent dependency on google api script, which can not be used as a module

if (localStorage.jwt_auth) window.location.href = "/";

window.onbeforeunload = function(e) {
  gapi.auth2.getAuthInstance().signOut(); // Prevent auto-login after logout
};

function init() {
  gapi.load('auth2', function() {
    auth2 = gapi.auth2.init({
      client_id: '191344389936-gus0astcrgrq9rbp62a9q6018b61tm89.apps.googleusercontent.com',
      cookiepolicy: 'single_host_origin',
      scope: 'profile'
    }).then(function(auth2) {
      gapi.auth2.getAuthInstance().signOut();
      $('#login-page').append('<div id="google-signin" class="g-signin2" data-onsuccess="onSignIn" style="display: none;"></div>');
      gapi.signin2.render('google-signin', {
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': onSignIn,
        'onfailure': function(error) {
          console.log(error);
        }
      })
      $("#google-signin").animate({opacity: "toggle"}, 700);
    });
  })
}



async function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  localStorage.setItem('id', profile.getId());
  localStorage.setItem('name', profile.getName());
  localStorage.setItem('prof_image', profile.getImageUrl());
  localStorage.setItem('email', profile.getEmail());
  var result = await request("post", "/oauth/v1/login", {token: googleUser.getAuthResponse().id_token});
  console.log(result);
  if (result.jwt) {
    console.log("success"); // Do something here
    localStorage.setItem('jwt_auth', result.jwt);
    window.location.href = "/";
  } else {
    console.log(result.message);
  }
}

init();

// styles
$(document).ready(function() {
  $('#login-page').animate({opacity: 'toggle'}, 1500);
})
