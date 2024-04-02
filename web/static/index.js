let map;
var lat, lng;
async function initMap() {

  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  const {Map} = await google.maps.importLibrary("maps");
  map = new Map(document.getElementById("map"), {
    center: new google.maps.LatLng(53.3498, -6.2603),
    zoom: 13,
    disableDefaultUI: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_CENTER
    },
    styles:[
      {
          "featureType": "all",
          "stylers": [
              {
                  "saturation": 0
              },
              {
                  "hue": "#e7ecf0"
              }
          ]
      },
      {
          "featureType": "road",
          "stylers": [
              {
                  "saturation": -70
              }
          ]
      },
      {
          "featureType": "transit",
          "stylers": [
              {
                  "visibility": "on"
              }
          ]
      },
      {
          "featureType": "poi",
          "stylers": [
              {
                  "visibility": "on"
              }
          ]
      },
      {
          "featureType": "water",
          "stylers": [
              {
                  "visibility": "simplified"
              },
              {
                  "saturation": -60
              }
          ]
      }
  ]
    
  });

  const stationsData = await GetStationsData();

  if(navigator.geolocation)
  {
    navigator.geolocation.getCurrentPosition((position)=>{
        lat = parseFloat(position.coords.latitude);
        lng = parseFloat(position.coords.longitude);
        map.setCenter(new google.maps.LatLng(lat, lng));
        //marker for current location
        new google.maps.Marker({
          position: new google.maps.LatLng(lat, lng),
          map:map,
          icon: {
            url: 'https://img.icons8.com/color/48/marker--v1.png',
            scaledSize: new google.maps.Size(35, 35),
          }
        });
       
      }, null, options);
  }
  //const stationsData = {{ stations|tojson }};
  
  // const weatherData = await GetWeatherData();

  const input = document.getElementById("pac-input");            
  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo("bounds", map);
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

    //calling 5 closest stations here to activate when location choosen
    map.fitBounds(place.geometry.viewport);
     findClosestStations(place, bikesData);
  });

   
  //marker for bike station locations
  for(var i=0; i< stationsData.length; i++)
  {
    const marker = new google.maps.Marker({
      position: new google.maps.LatLng(stationsData[i].position.lat, stationsData[i].position.lng),
      map,
      icon:{
        url:"../static/bicycle-bike-svgrepo-com.png",
        scaledSize: new google.maps.Size(35,35)
      }
    });
    AddInfoWindow(marker, map, stationsData[i]);
  }
}

function AddInfoWindow(marker, map, markerData)
{
  const bikeStationInfo = 
  ` <div class="stationsInfo">
    <h3 class="infoHeading">${markerData.name}</h3>
    <p class="info">Status: ${markerData.status}</p>
    <p class="info">Available Bikes: ${markerData.available_bikes}</p>
    <p class="info">Parking: ${markerData.available_bike_stands}</p>
    <p class="info">Banking: ${markerData.banking ? "Yes":"No"}</p>
    </div>`

  const infoWindow = new google.maps.InfoWindow({
    content:bikeStationInfo
  });

  //displaying information of bike station when the user hovers over the marker on map
  marker.addListener("mouseover", ()=>{
    infoWindow.open({
      anchor:marker,
      map
    });
  });

//closing information window when marker loses mouse focus
  marker.addListener("mouseout", ()=>{
    infoWindow.close();
  })
}


//getting static stations data from flask routen 
async function GetStationsData() {
  try {
     const response = await fetch("http://localhost:5000/", {mode: "cors"});
   
     if (!response.ok) {
       throw new Error(`HTTP error! status: ${response.status}`);
     }

     // Parse the response as JSON
     const bikesData = await response.json();

     // Return the parsed JSON data
     console.log(bikesData)
     return bikesData;
  } catch (error) {
     console.error("Failed to fetch stations data:", error);
     return {};
  }}

//For Testing
// async function GetStationsData()
// {
//   const bikePromise = await fetch("https://api.jcdecaux.com/vls/v1/stations?contract=dublin&apiKey=9923c4b16f8c5fd842f2f448564bed43a349fa47", {mode:"cors"})
//   bikesData = await bikePromise.json(); 
//   return bikesData;
// }

//TODO need to get availability data from flask 

//TODO need to get weather data from flask 
async function GetWeatherData()
{
  const weatherPromise = await fetch("http://api.weatherapi.com/v1/current.json?key=0f5a8ade5f024e70a34123035241602&q=dublin",{mode:"cors"});
  wData = await weatherPromise.json();
  return wData;
}

async function GetLatAndLang(lat, lng)
{
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  const {Map} = await google.maps.importLibrary("maps");
  map = new Map(document.getElementById("map"), {
    center: new google.maps.LatLng(53.3498, -6.2603),
    zoom: 13,
    disableDefaultUI: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_CENTER
    },
    styles:[
      {
          "featureType": "all",
          "stylers": [
              {
                  "saturation": 0
              },
              {
                  "hue": "#e7ecf0"
              }
          ]
      },
      {
          "featureType": "road",
          "stylers": [
              {
                  "saturation": -70
              }
          ]
      },
      {
          "featureType": "transit",
          "stylers": [
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "poi",
          "stylers": [
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "water",
          "stylers": [
              {
                  "visibility": "simplified"
              },
              {
                  "saturation": -60
              }
          ]
      }
  ]
    
  });

//when user uses search bar 
  if(navigator.geolocation)
  { 
    navigator.geolocation.getCurrentPosition((position)=>{
        lat = parseFloat(position.coords.latitude);
        lng = parseFloat(position.coords.longitude);
        map.setCenter(new google.maps.LatLng(lat, lng));
       
        //marker for current location
        new google.maps.Marker({
          position: new google.maps.LatLng(lat, lng),
          map:map,
          icon: {
            url: 'https://img.icons8.com/color/48/marker--v1.png',
            scaledSize: new google.maps.Size(35, 35),
          }
        });
      }, null, options);
  }

  const stationsData = await GetStationsData();
  // const weatherData = await GetWeatherData();

  const input = document.getElementById("pac-input");            
  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo("bounds", map);
  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) {
        window.alert("No details available for input: '" + place.name + "'");
        return;
    }
    map.fitBounds(place.geometry.viewport);
  
    findClosestStations(place, bikesData);
  
    
  });

  
  //marker for bike station locations
  for(var i=0; i< stationsData.length; i++)
  {
    const marker = new google.maps.Marker({
      position: new google.maps.LatLng(stationsData[i].position.lat, stationsData[i].position.lng),
      map,
      icon:{
        url:"../static/bicycle-svgrepo-com.png",
        scaledSize: new google.maps.Size(35,35)
      }
    });
    AddInfoWindow(marker, map, stationsData[i]);
  }
}

function AddInfoWindow(marker, map, markerData)
{
  //TODO for i in stattions data let number = number in availability table & use that table instead 

  const bikeStationInfo = 
  ` <div class="stationsInfo">
    <h3 class="infoHeading">${markerData.name}</h3>
    <p class="info">Status: ${markerData.status}</p>
    <p class="info">Available Bikes: ${markerData.available_bikes}</p>
    <p class="info">Parking: ${markerData.available_bike_stands}</p>
    <p class="info">Banking: ${markerData.banking ? "Yes":"No"}</p>
    </div>`

  const infoWindow = new google.maps.InfoWindow({
    content:bikeStationInfo
  });

  //displaying information of bike station when the user hovers over the marker on map
  marker.addListener("mouseover", ()=>{
    infoWindow.open({
      anchor:marker,
      map
    });
  });

//closing information window when marker loses mouse focus
  marker.addListener("mouseout", ()=>{
    infoWindow.close();
  })
}


//function to find the 5 closest stations by lat, lng and return them in a list 
 function findClosestStations(place, stationsData) {
  //finding lat & lng of user 
  let location = place.geometry.location;
  let lat = location.lat();
  let lng = location.lng();
  console.log("lat: " + lat ); //*testing purposes only 
  // console.log("lng: " + lng); 
  const stationList = []; 


  //error handing for bikesData //TODO need to handle better once actually working 
  if (!stationsData) {
    console.log('!!! stationsData is undefined or null !!!');
    return; // Exit the function if stationsData is not valid
  }
  else{
    console.log("stations data reading correctly ")
  }

 // Iterate over the stationsData object to get distance from place lat & lng 
 stationsData.forEach(stationData => {
  // Check if stationData and its position are defined
  if (stationData && stationData.position) {
    let latDiff = stationData.position.lat - lat;
    let lngDiff = stationData.position.lng - lng;
    let distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
    let stationID = stationData.number; 
    let stationName = stationData.name;

    // Store the station ID and its distance from the given latitude and longitude
    stationList.push({station: stationID, name: stationName, distance: distance});
  } else {
    console.error('stationData or its position is undefined');
  }
});
   
  // Sort by distance and take the first 5 closest 
stationList.sort((a, b) => a.distance - b.distance);
const closestStations = stationList.slice(0, 5);

  // Return the closest stations in pop up window 
  showPopup(closestStations);
 }
//end of findClosestStation function 


//popup for closest stations
function showPopup(closestStations) {
  console.log("pop up ")
  // Generate the content for the popup
  let content = '';
  closestStations.forEach(station => {
     content += `<p>Station ID: ${station.station}, Station: ${station.name}, Distance: ${station.distance} meters</p>`;
  });
 
  // Set the content of the popup
  document.getElementById('station-info').innerHTML = content;
 
  // Show the popup
  document.getElementById('popup-window').style.display = 'block';
 }
 
 // Get the close button element
 var closeButton = document.getElementById('close-button');
 
 // Add a click event listener to the close button
 closeButton.addEventListener('click', function() {
  document.getElementById('popup-window').style.display = 'none';
 });
 

//journey planner functions start 

//TODO get user input from start

//TODO get user input from destination 

//TODO get user input from time choice 

//TODO get user input from date 

//TODO using inputs get ML prediction for start station 

//TODO using inputs get ML prediction for destination station 
//? might end to set time difference for this? 
//end of journey planner functions
