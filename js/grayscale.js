/*!
 * Start Bootstrap - Grayscale Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// jQuery to collapse the navbar on scroll
function collapseNavbar() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
}

$(window).scroll(collapseNavbar);
$(document).ready(collapseNavbar);

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
  if ($(this).attr('class') != 'dropdown-toggle active' && $(this).attr('class') != 'dropdown-toggle') {
    $('.navbar-toggle:visible').click();
  }
});

// Google Maps Scripts
var map = null;
// When the window has finished loading create our google map below
google.maps.event.addDomListener(window, 'load', init(0, 0));
// google.maps.event.addDomListener(window, 'resize', function() {
//     map.setCenter(new google.maps.LatLng(40.6700, -73.9400));
// });

function init(lat, lon) {
    // Basic options for a simple Google Map
    // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
    var mapOptions = {
        // How zoomed in you want the map to start at (always required)
        zoom: 15,

        // The latitude and longitude to center the map (always required)
        center: new google.maps.LatLng(lat, lon), // New York

        // Disables the default Google Maps UI components
        disableDefaultUI: true,
        scrollwheel: false,
        draggable: false,

        // How you would like to style the map.
        // This is where you would paste any style found on Snazzy Maps.
        styles: [{
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 17
            }]
        }, {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 20
            }]
        }, {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 17
            }]
        }, {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 29
            }, {
                "weight": 0.2
            }]
        }, {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 18
            }]
        }, {
            "featureType": "road.local",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 16
            }]
        }, {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 21
            }]
        }, {
            "elementType": "labels.text.stroke",
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#000000"
            }, {
                "lightness": 16
            }]
        }, {
            "elementType": "labels.text.fill",
            "stylers": [{
                "saturation": 36
            }, {
                "color": "#000000"
            }, {
                "lightness": 40
            }]
        }, {
            "elementType": "labels.icon",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 19
            }]
        }, {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 20
            }]
        }, {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 17
            }, {
                "weight": 1.2
            }]
        }]
    };

    // Get the HTML DOM element that will contain your map
    // We are using a div with id="map" seen below in the <body>
    var mapElement = document.getElementById('map');

    // Create the Google Map using out element and options defined above
    map = new google.maps.Map(mapElement, mapOptions);

    // Custom Map Marker Icon - Customize the map-marker.png file to customize your icon
    var image = 'img/map-marker.png';
    var myLatLng = new google.maps.LatLng(lat, lon);
    var beachMarker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        icon: image
    });
}

function getLocation () {
  navigator.geolocation.getCurrentPosition(handle_location_position, handle_location_errors);
}

function handle_location_errors (error) {
  switch(error.code) {
    case error.PERMISSION_DENIED: alert("User denied access to their location.");
    break;

    case error.POSITION_UNAVAILABLE: alert("Could not detect location at this time.");
    break;

    case error.TIMEOUT: alert("Request to get location timed out.");
    break;

    default: alert("An unknown error occured.");
    break;
  }
}

function handle_location_position (position) {
  var lat = position.coords.latitude;
  var lon = position.coords.longitude;
  var metroArea = '';
  var metroId = '';
  var API_KEY = '5o9IuVllmAK38SnM';
  var LOCATION_URL = 'http://api.songkick.com/api/3.0/search/locations.json?location=geo:' + lat + ',' + lon + '&apikey=' + API_KEY;

  google.maps.event.addDomListener(window, 'load', init(lat, lon));

  // $.ajax({
  //     dataType: 'json',
  //     url: LOCATION_URL
  //   , success: function (response) {
  //       if (response) {
  //         var location = response.resultsPage.results.location[0];
  //         metroArea = location.metroArea.displayName;
  //         metroId = location.metroArea.id;
  //         console.log('AREA: ' + metroArea);
  //         console.log('ID: ' + metroId);
  //         var metroText = "Find shows near " + metroArea;
  //         document.getElementById("metroLabel").innerHTML = metroText;
  //       } else {
  //         alert("An error occurred.");
  //       }
  //     }
  // });

}

function loadShows(metroId) {
  var API_KEY = '5o9IuVllmAK38SnM';
  var LOCATION_URL = 'http://api.songkick.com/api/3.0/search/locations.json?query=montreal&apikey=' + API_KEY;

  var EVENTS_URL = 'http://api.songkick.com/api/3.0/metro_areas/' + metroId + '/calendar.json?apikey=' + API_KEY;

  $.getJSON(EVENTS_URL), function (response) {
    console.log(response);
    $.each(response.resultsPage.results, function (i, event) {
      console.log(event.displayName);
    });
  };

}

$(function () {
    var extractToken = function(hash) {
      var match = hash.match(/access_token=([\w-]+)/);
      return !!match && match[1];
    };

    var CLIENT_ID = 'e3805252f21a42ff8331d509ba4faaea';
    var AUTHORIZATION_ENDPOINT = "https://accounts.spotify.com/authorize";
    var RESOURCE_ENDPOINT = "https://api.spotify.com/v1/me/albums?limit=50";

    var token = extractToken(document.location.hash);
    if (token) {
      $.ajax({
          dataType: 'json',
          url: RESOURCE_ENDPOINT
        , beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', "Bearer " + token);
          }
        , success: function (response) {

            if (response) {
              var body = "";
              var mySet = new Set();

              $.each(response.items, function (i, item) {
                mySet.add(item.album.artists[0].name);
              });

              console.log(body);
            } else {
              alert("An error occurred.");
            }
          }
      });
    } else {

      var authUrl = AUTHORIZATION_ENDPOINT + '?client_id=' + CLIENT_ID +
            '&response_type=token' +
            '&scope=user-library-read' +
            '&redirect_uri=' + window.location;

      $("#login").attr("href", authUrl);
    }
  });

$(document).ready(
  function() {
      $("#location").click(getLocation);
  }
);
