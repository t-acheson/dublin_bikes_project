let map;
let lat, lng;
async function initMap() {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  const { Map } = await google.maps.importLibrary("maps");
  map = new Map(document.getElementById("map"), {
    center: new google.maps.LatLng(53.3498, -6.2603),
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

  const stationsData = await GetStationsData();

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        lat = parseFloat(position.coords.latitude);
        lng = parseFloat(position.coords.longitude);
        map.setCenter(new google.maps.LatLng(lat, lng));

        //marker for current location
        new google.maps.Marker({
          position: new google.maps.LatLng(lat, lng),
          map: map,
          icon: {
            url: "https://img.icons8.com/color/48/marker--v1.png",
            scaledSize: new google.maps.Size(35, 35),
          },
        });
        //Fetching nearest bikes for current location
        DisplayClosestStations(FindClosestStations(lat, lng, stationsData));
      },
      null,
      options
    );
  }

  const input = document.getElementById("pac-input");
  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo("bounds", map);


// // Create a container for the Autocomplete input
// const autocompleteContainer = document.createElement('div');
// autocompleteContainer.classList.add('autocomplete-container');
// autocompleteContainer.innerHTML = "Dimag mei lund, zindagi jhund";
// autocompleteContainer.appendChild(input);

// Add styling for the autocomplete container
// autocompleteContainer.style.position = 'absolute';
// autocompleteContainer.style.top = '10px'; // Adjust as needed
// autocompleteContainer.style.left = '10px';
// autocompleteContainer.style.padding = '10px !important'; // Adjust as needed

// Push the autocomplete container to the top left corner of the map
// map.controls[google.maps.ControlPosition.TOP_LEFT].push(autocompleteContainer);


  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) {
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }
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
    DisplayClosestStations(
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
function DisplayClosestStations(closestStations) {
  let popup = document.getElementById("closestStations");

  popup.innerHTML = "<h3> Nearest Stations </h3>";
  // Populate the div with the station information
  closestStations.forEach((station) => {
    let stationInfo = document.createElement("div");
    stationInfo.innerHTML = `
    <p>${station.name} </p>
    <p>${station.position.lat} </p>
    <p> ${station.position.lng}</p>`
    popup.appendChild(stationInfo);
  });
}