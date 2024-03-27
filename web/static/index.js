let map;
let lat, lng;
let previousStation = null;
let directionsService , directionsRenderer;
async function initMap() {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  lat = 53.3498;
  lng = -6.2603;

  const { Map } = await google.maps.importLibrary("maps");
  map = new Map(document.getElementById("map"), {
    center: new google.maps.LatLng(lat, lng),
    zoom: 13,
    disableDefaultUI: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_CENTER,
    },
    styles: [
      {
        featureType: "all",
        stylers: [
          {
            saturation: 0,
          },
          {
            hue: "#e7ecf0",
          },
          {
            fontFamily: "Protest Riot, sans-serif",
          },
        ],
      },
      {
        featureType: "road",
        stylers: [
          {
            saturation: -70,
          },
        ],
      },
      {
        featureType: "transit",
        stylers: [
          {
            visibility: "on",
          },
        ],
      },
      {
        featureType: "poi",
        stylers: [
          {
            visibility: "on",
          },
        ],
      },
      {
        featureType: "water",
        stylers: [
          {
            visibility: "simplified",
          },
          {
            saturation: -60,
          },
        ],
      },
    ],
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({map, panel: document.getElementById("panel")});
  var initialMarker = new google.maps.Marker({
    position: new google.maps.LatLng(lat, lng),
    map: map,
    icon: {
      url: "https://img.icons8.com/color/48/marker--v1.png",
      scaledSize: new google.maps.Size(35, 35),
    },
  });

  const stationsData = await GetStationsData();

  //Fetching nearest bikes for current location
  DisplayClosestStations(map, FindClosestStations(lat, lng, stationsData));

 
  // if (navigator.geolocation) {
  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       lat = parseFloat(position.coords.latitude);
  //       lng = parseFloat(position.coords.longitude);
  //       map.setCenter(new google.maps.LatLng(lat, lng));

  //       //marker for current location
  //       new google.maps.Marker({
  //         position: new google.maps.LatLng(lat, lng),
  //         map: map,
  //         icon: {
  //           url: "https://img.icons8.com/color/48/marker--v1.png",
  //           scaledSize: new google.maps.Size(35, 35),
  //         },
  //       });
  //       //Fetching nearest bikes for current location
  //       DisplayClosestStations(map, FindClosestStations(lat, lng, stationsData));
  //     },
  //     null,
  //     options
  //   );
  // }

  const input = document.getElementById("pac-input");
  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo("bounds", map);

  const container = document.getElementById('googlemaps')
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(container);

  const panel = document.getElementById('panel');
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(panel);

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) {
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    initialMarker.setMap(null);

    lat = place.geometry.location.lat();
    lng = place.geometry.location.lng();
    //placing a marker at the searched location
    new google.maps.Marker({
      position: new google.maps.LatLng(
        place.geometry.location.lat(),
        place.geometry.location.lng()
      ),
      map: map,
      icon: {
        url: "https://img.icons8.com/color/48/marker--v1.png",
        scaledSize: new google.maps.Size(35, 35),
      },
    });
    //fetching nearby bike stations for searched location
    DisplayClosestStations(map,
      FindClosestStations(
        place.geometry.location.lat(),
        place.geometry.location.lng(),
        stationsData
      )
    );
    map.fitBounds(place.geometry.viewport);
  });

  //marker for bike station locations
  for (var i = 0; i < stationsData.length; i++) {
    const marker = new google.maps.Marker({
      position: new google.maps.LatLng(
        stationsData[i].position.lat,
        stationsData[i].position.lng
      ),
      map,
      icon: {
        url: "../static/images/bicycle-bike-svgrepo-com.png",
        scaledSize: new google.maps.Size(35, 35),
      },
    });
    AddInfoWindow(marker, map, stationsData[i]);
  }
}

function AddInfoWindow(marker, map, markerData) {
  const bikeStationInfo = ` <div class="stationsInfo">
    <h3 class="infoHeading">${markerData.name}</h3>
    <p class="info">Status: ${markerData.status}</p>
    <p class="info">Available Bikes: ${markerData.available_bikes}</p>
    <p class="info">Parking: ${markerData.available_bike_stands}</p>
    <p class="info">Banking: ${markerData.banking ? "Yes" : "No"}</p>
    </div>`;

  const infoWindow = new google.maps.InfoWindow({
    content: bikeStationInfo,
  });

  //displaying information of bike station when the user hovers over the marker on map
  marker.addListener("mouseover", () => {
    infoWindow.open({
      anchor: marker,
      map,
    });
  });

  //closing information window when marker loses mouse focus
  marker.addListener("mouseout", () => {
    infoWindow.close();
  });
}

async function GetStationsData() {
  const bikePromise = await fetch(
    "https://api.jcdecaux.com/vls/v1/stations?contract=dublin&apiKey=9923c4b16f8c5fd842f2f448564bed43a349fa47",
    { mode: "cors" }
  );
  bikesData = await bikePromise.json();
  return bikesData;
}

//function to find the 5 closest stations by lat, lng and return them in a list
function FindClosestStations(lat, lng, stationsData) {
  if (!stationsData) {
    console.log("!!! stationsData is undefined or null !!!");
    return; // Exit the function if stationsData is not valid
  }
  const stationList = [];

  // Iterate over the stationsData object
  Object.entries(stationsData).forEach(([stationId, stationData]) => {
    let latDiff = stationData.position.lat - lat;
    let lngDiff = stationData.position.lng - lng;
    let calculatedDistance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);

    // Store the station data and its distance from the given latitude and longitude
    stationList.push({ station: stationData, distance: calculatedDistance });
  });

  // Sort by distance and take the first 5 closest
  stationList.sort((a, b) => a.distance - b.distance);
  let closestStations = stationList.slice(0, 5).map((item) => item.station);

  // Return the closest stations
  return closestStations;
}

//popup for closest stations
function DisplayClosestStations(map, closestStations) {
  let popup = document.getElementById("closestStations");

  popup.innerHTML = "<h2> Nearest Stations </h2>";

  const panel = document.getElementById('panel');
  closestStations.forEach((station) => {
    let stationInfo = document.createElement("div");
    stationInfo.className="stationDiv";
    stationInfo.addEventListener("click", (event)=>{
      if(event.target === stationInfo)
      {
        //checks if we have rendered directions for some other station before
        if(previousStation)
        {
          directionsRenderer.setMap(null);
        }
        previousStation = station
        GetRoute(lat, lng , station.position.lat, station.position.lng);


      }
    });
    
    stationInfo.innerHTML = `
    <div>${station.name}</div>
    <div>${station.position.lat}</div>
    <div>${station.position.lng}</div>`
    popup.appendChild(stationInfo);
  });

  const stationElements = document.getElementsByClassName("stationDiv");
  popup.onclick = (event)=>{
    for(let i = 0; i < stationElements.length; i++)
    {
      if(stationElements[i].style.display==="none")
      {
        stationElements[i].style.display = "flex";
      }
      else
      {
        stationElements[i].style.display = "none";
      }
    }
  }

  // Populate the div with the station information
}

function GetRoute(lat, lng, destLat, destLng)
{

  directionsRenderer.setMap(map);

  var start = new google.maps.LatLng(lat, lng);
  var end = new google.maps.LatLng(destLat, destLng);

  var request = {
    origin: start,
    destination: end,
    travelMode: 'BICYCLING'
  };
  directionsService.route(request, function(result, status) {
    if (status == 'OK') {
      directionsRenderer.setDirections(result);
    }
  });

  const panel = document.getElementById('panel');
  panel.style.display = "block";
}

