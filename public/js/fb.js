window.fbAsyncInit = function() {
        FB.init({
          appId      : '1556663711272087',
          xfbml      : true,
          version    : 'v2.1'
        });
      };

      (function(d, s, id){
         var js, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) {return;}
         js = d.createElement(s); js.id = id;
         js.src = "//connect.facebook.net/en_US/sdk.js";
         fjs.parentNode.insertBefore(js, fjs);

      var getFBData = function () {
        FB.api('/me', function(response) {
          fbinfo = new Array();
          fbinfo[0] = response.id;

          var im = document.getElementById("profile-image").setAttribute("src", "http://graph.facebook.com/" + fbinfo[0] + "/pciture?type=normal");
        });
    };

    getFBData();
}(document, 'script', 'facebook-jssdk'));



$(function() {
  
});