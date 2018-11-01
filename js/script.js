$(document).ready(function(){
  $('#scrolly').click(function() {
    document.querySelector('#about').scrollIntoView({
      behavior: 'smooth'
    });
  });
});
