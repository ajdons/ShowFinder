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

var artistSet = new Set();
var eventSet = new Set();
var metroId = 27377;
function getLocation () {
  jQuery.post( "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyDoCUgILfrHRQ2-C6hlxfeWs9PM-v-fxbI", function(success) {
		handleLocationSuccess({coords: {latitude: success.location.lat, longitude: success.location.lng}});
  })
  .fail(function(err) {
    console.log("API Geolocation error! \n\n"+err);
    var metroText = "Find shows near Montréal";
    document.getElementById("metroLabel").innerHTML = metroText;
    $('html, body').animate({
      scrollTop: $("#shows_section").offset().top}, 2000);
    });
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

function handleLocationSuccess (position) {
  var lat = position.coords.latitude;
  var lon = position.coords.longitude;
  var metroArea = '';
  var API_KEY = '5o9IuVllmAK38SnM';
  var LOCATION_URL = 'http://api.songkick.com/api/3.0/search/locations.json?location=geo:' + lat + ',' + lon + '&apikey=' + API_KEY;

  $.ajax({
      dataType: 'json',
      url: LOCATION_URL
    , success: function (response) {
        if (response) {
          var location = response.resultsPage.results.location[0];
          metroArea = location.metroArea.displayName;
          metroId = location.metroArea.id;
          console.log('AREA: ' + metroArea);
          console.log('ID: ' + metroId);
          var metroText = "Find shows near " + metroArea;
          document.getElementById("metroLabel").innerHTML = metroText;
          $('html, body').animate({
      scrollTop: $("#shows_section").offset().top}, 2000);
        } else {
          alert("An error occurred.");
        }
      }
  });

}

function loadShows() {
  showLoadingDialog("Finding shows in your area");
  makeSongkickCall(1);
}

$(function () {
    var extractToken = function(hash) {
      var match = hash.match(/access_token=([\w-]+)/);
      return !!match && match[1];
    };

    var CLIENT_ID = 'e3805252f21a42ff8331d509ba4faaea';
    var AUTHORIZATION_ENDPOINT = "https://accounts.spotify.com/authorize";
    var RESOURCE_ENDPOINT = "https://api.spotify.com/v1/me/tracks?limit=50";

    var token = extractToken(document.location.hash);
    if (token) {
        removeHash();
        makeSpotifyCall(token, RESOURCE_ENDPOINT);
        $('html, body').animate({scrollTop: $("#location_section").offset().top}, 2000);
        showLoadingDialog();
    } else {

      var authUrl = AUTHORIZATION_ENDPOINT + '?client_id=' + CLIENT_ID +
            '&response_type=token' +
            '&scope=user-library-read' +
            '&redirect_uri=' + window.location;

      $("#login").attr("href", authUrl);
    }
  });

function removeHash () {
    history.pushState("", document.title, window.location.pathname
                                                       + window.location.search);
}

function makeSongkickCall(page) {
  var API_KEY = '5o9IuVllmAK38SnM';
  var EVENTS_URL = 'http://api.songkick.com/api/3.0/metro_areas/' + metroId + '/calendar.json?apikey=' + API_KEY + "&page=" + page;
  $.ajax({
      dataType: 'json',
      url: EVENTS_URL
    , success: function (response) {
        if (response) {
          handleSongkickResponse(response, page);
        } else {
          alert("An error occurred.");
        }
      }
  });
}

function handleSongkickResponse(response, page) {
    if(response.resultsPage.results.event != null) {
      $.each(response.resultsPage.results.event, function (i, eventObject) {
        $.each(eventObject.performance, function (i, artist) {
          if(artistSet.has(artist.displayName)) {
            eventSet.add(eventObject);
          }
        });
      });
      setProgress(0, 100, ((page + 1) /10) * 100);
      //Load max of 10 pages
      if(page < 10) {
        makeSongkickCall(page+1);
      } else {
        displayEventResults();
      }
    }
    else {
      displayEventResults();
    }
}

function makeSpotifyCall(token, url) {
  $.ajax({
      dataType: 'json',
      url: url
    , beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', "Bearer " + token);
      }
    // , statusCode: {
    //      502: function() {
    //         alert('Error loading your tracks');
    //      }
    //    }
    , error: function (response) {
      alert('ERROR');
    }
    , success: function (response) {
        if (response) {
          handleSpotifyResponse(response, token)
        } else {
          alert("An error occurred.");
        }
      }
  });
}

function handleSpotifyResponse(response, token) {
  if (response.items.length > 0){
    $.each(response.items, function (i, item) {
      artistSet.add(item.track.artists[0].name);
    });
    setProgress(0, 100, (response.offset + 50)/response.total * 100);
    if (response.next) {
      makeSpotifyCall(token, response.next);
    } else {
      hideLoadingDialog();
    }
  } else {
    hideLoadingDialog();
  }
}

function displayEventResults() {
  $('html, body').animate({
scrollTop: $("#results_section").offset().top}, 2000);
hideLoadingDialog();
let listItem = document.querySelector(".results")
  eventSet.forEach(function(index, eventObject, set) {
    var artistString = "";
    $.each(eventObject.performance, function (i, artist) {
      if(artistSet.has(artist.displayName)) {
        artistString += artist.displayName + ", ";
      }
    });
    var listValue = document.createElement("li");
    listValue.textContent = eventObject.displayName;
    listItem.appendChild(listValue);
  });
}

/**
 * Displays overlay with "Please wait" text. Based on bootstrap modal. Contains animated progress bar.
 */
function showLoadingDialog(message) {
    $("#progressMessage").text(message);
    $("#loadingDialog").modal("show");
}

function setProgress(min, max, current) {
  $('#ariaProgress').attr('aria-valuemin', min);
  $('#ariaProgress').attr('aria-valuemax', max);
  $('#ariaProgress').attr('aria-valuenow', current).css('width', current + "%");
}

/**
 * Hides "Please wait" overlay. See function showPleaseWait().
 */
function hideLoadingDialog() {
    $("#loadingDialog").modal("hide");
    setProgress(0, 100, 0);
}

$(document).ready(
  function() {
    $("#location").click(getLocation);
    $("#shows").click(loadShows);
  }
);
