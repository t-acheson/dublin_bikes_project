let firstDropdown;
let secondDropdown;

let map;
let lat, lng;
let previousStation = null;
let directionsService , directionsRenderer, distanceService;
let source, destination;
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
    styles:[
      {
          "stylers": [
              {
                  "saturation": -100
              }
          ]
      },
      {
          "featureType": "water",
          "elementType": "geometry.fill",
          "stylers": [
              {
                  "color": "#0099dd"
              }
          ]
      },
      {
          "elementType": "labels",
          "stylers": [
              {
                  "visibility": "on"
              }
          ]
      },
      {
          "featureType": "poi.park",
          "elementType": "geometry.fill",
          "stylers": [
              {
                  "color": "#aadd55"
              }
          ]
      },
      {
          "featureType": "road.highway",
          "elementType": "labels",
          "stylers": [
              {
                  "visibility": "on"
              }
          ]
      },
      {
          "featureType": "road.arterial",
          "elementType": "labels.text",
          "stylers": [
              {
                  "visibility": "on"
              }
          ]
      },
      {
          "featureType": "road.local",
          "elementType": "labels.text",
          "stylers": [
              {
                  "visibility": "on"
              }
          ]
      },
      {}
  ]
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({map, panel: document.getElementById("panel")});
  distanceService = new google.maps.DistanceMatrixService();
  //initial marker marks the location which google maps will automatically assume as starting point for the user
  var initialMarker = new google.maps.Marker({
    position: new google.maps.LatLng(lat, lng),
    map: map,
    icon: {
      url: "https://img.icons8.com/color/48/marker--v1.png",
      scaledSize: new google.maps.Size(35, 35),
    },
  });

  //fetching stations Data sent by app.py
  var scriptTag = document.getElementById("mainScript");
  const stationsData = JSON.parse(scriptTag.dataset.stations);

  const input = document.getElementById("pac-input");
  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo("bounds", map);

  // const container = document.getElementById('googlemaps')
  // map.controls[google.maps.ControlPosition.TOP_LEFT].push(container);

  const panel = document.getElementById('panel');
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(panel);

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) {
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    //removing the marker for original location
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
    //showing closest stations when user searches for it
    findClosestStations(lat, lng, stationsData);
    map.fitBounds(place.geometry.viewport);
  });

  //displaying the journey form when user clicks on the button
  const journeyButton = document.getElementById("journeyPlanner");
  journeyButton.addEventListener("click",()=>{
    //show journey planner form
    document.getElementById('travelForm').style.display = 'block';
  });


 //start of bike station marker functions 

  //marker for bike station locations
  for (var i = 0; i < stationsData.length; i++) {
    const marker = new google.maps.Marker({
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(
        stationsData[i].position_lat,
        stationsData[i].position_lng
      ),
      map,
      icon:{
        url:"../static/bicycle-bike-svgrepo-com.png",
        scaledSize: new google.maps.Size(35,35)
      }
    });


 //calling window based on number 
   AddInfoWindow(marker, map, stationsData[i]);
  }
  FillStations(stationsData);

  // Get the close button element
  var closeButton = document.getElementById('close-button');
 
  // Add a click event listener to the close button
  closeButton.addEventListener('click', function() {
    document.getElementById('popup-window').style.display = 'none';
  });

  var closeJourneyButton = document.getElementById("close");
  closeJourneyButton.addEventListener("click",()=>{
    document.getElementById("travelForm").style.display = 'none';
  });

  var closeDirectionsButton = document.getElementById("closeDirections");
  closeDirectionsButton.addEventListener("click", ()=>{
    document.getElementById("panel").style.display = 'none';
  });
}

async function AddInfoWindow(marker, map, markerData) {

  const liveData = await GetOccupancyData(markerData.number);

  const liveBikeStationInfo = ` <div class="stationsInfo">
    <h3 class="infoHeading">${markerData.name}</h3>
    <p class="info">Available Bikes: ${liveData[0]}</p>
    <p class="info">Parking: ${liveData[1]}</p>
    <p class="info">Banking: ${markerData.banking ? "Yes" : "No"}</p>
    </div>`;

  const infoWindow = new google.maps.InfoWindow({
    content: liveBikeStationInfo,
  });

  //displaying information of bike station when the user clicks on the marker on map
  marker.addListener("click", () => {
    infoWindow.open({
      anchor: marker,
      map,
    });
    marker.setAnimation(google.maps.Animation.BOUNCE);
  });

  //closing information window when marker loses mouse focus
  marker.addListener("mouseout", () => {
    infoWindow.close();
    marker.setAnimation(null);
  });
}
//end of bike station marker functions 

//start of async functions to fetch data 

//getting static stations data from flask routen 
// async function GetStationsData() {
//   try {
//      const response = await fetch("http://localhost:5000/", {mode: "cors"});
   
//      if (!response.ok) {
//        throw new Error(`HTTP error! status: ${response.status}`);
//      }

//      // Parse the response as JSON
//      const bikesData = await response.json();

//      // Return the parsed JSON data
//      console.log(bikesData)
//      return bikesData;
//   } catch (error) {
//      console.error("Failed to fetch stations data:", error);
//      return {};
//   }
// }

// async function GetStationsData()
// {
//   const bikePromise = await fetch("https://api.jcdecaux.com/vls/v1/stations?contract=dublin&apiKey=9923c4b16f8c5fd842f2f448564bed43a349fa47", {mode:"cors"})
//   bikesData = await bikePromise.json(); 
//   return bikesData;
// }

async function GetOccupancyData(stationId) {
  try {
      // Fetch occupancy data from the specified endpoint
      
       const response = await fetch(`http://localhost:5000/occupancy/${stationId}`, { method: "GET", mode: "cors" });

      // Check if the response is successful
      if (!response.ok) {
          // If not, throw an error with the response status
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse the response as JSON
      const occupancyData = await response.json();

      // Log the parsed JSON data
      // console.log(occupancyData.occupancy[0]); //this is working!
      
      // Return the parsed JSON data
      return occupancyData.occupancy[0];
  } catch (error) {
      // If there's an error, log the error message and return an empty object
      console.error("Failed to fetch occupancy data:", error);
      return {};
  }
}

async function GetRecentOccupancyData(stationId) {
  try {
    // Fetch last 7 days occupancy data from the specified endpoint
    const response = await fetch(`http://localhost:5000/recentoccupancy/${stationId}`, { method: "GET", mode: "cors" });

    // Check if the response is successful
    if (!response.ok) {
      // If not, throw an error with the response status
      throw new Error(`HTTP error! status: ${response.status}`);
  }

    // Parse the response as JSON
    const recentoccupancyData = await response.json();

    // Log the parsed JSON data
    console.log(recentoccupancyData);

    // Return the parsed JSON data
    return recentoccupancyData;
} catch (error) {
    // If there's an error, log the error message and return an empty object
    console.error("Failed to fetch recent occupancy data:", error);
    return {};
}
}

async function GetWeatherData() {
  try {
      const response = await fetch("http://localhost:5000/weather", {method: "GET", mode: "cors"});
 
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
 
      // Parse the response as JSON
      const wData = await response.json();
 
      // Return the parsed JSON data
      console.log(wData);
      return wData;
  } catch (error) {
      console.error("Failed to fetch weather data:", error);
      return {};
  }
 }
 //end of async functions to fetch data 

//function to find the 5 closest stations by lat, lng and return them in a list 
async function findClosestStations(lat, lng, stationsData) {

  const stationList = []; 
  //error handing for bikesData 
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
  if (stationData) {
    let latDiff = (stationData.position_lat - lat) * (Math.PI /180);
    let lngDiff = (stationData.position_lng - lng) * (Math.PI /180);
    const R = 6371; // Radius of the Earth in kilometers
    const a =
    Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
    Math.cos(lat * (Math.PI / 180)) * Math.cos(stationData.position_lat * (Math.PI / 180)) *
    Math.sin(lngDiff / 2) * Math.sin(lngDiff / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = (R * c).toFixed(3); // Distance in kilometers rounded to three decimal places

    let stationID = stationData.number; 
    let stationName = stationData.name;

    // Store the station ID and its distance from the given latitude and longitude
    stationList.push({station: stationID, name: stationName, distance: distance, latitude:stationData.position_lat, longitude: stationData.position_lng});
  } else {
    console.error('stationData or its position is undefined');
  }
});
   
  // Sort by distance and take the first 5 closest 
stationList.sort((a, b) => a.distance - b.distance);
const closestStations = stationList.slice(0, 5);

for(var i=0 ; i< closestStations.length; i++)
{
  closestStations[i].distance = await GetDistance(closestStations[i].latitude, closestStations[i].longitude, lat, lng);
}

 //calling occupancy averages while loading closest stations 
 for (let station of closestStations){
  let stationID = station.station;
  console.log("in recent occupany loop")
  fetch(`/recentoccupancy/${stationID}`) // Replace <stationid> with the actual station ID
      .then(response => {
          // Check if the response is successful
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          // Parse the JSON response
          return response.json();
      })
      .then(data => {
          // Handle the JSON data returned from Flask
          console.log(data);
      })
      .catch(error => {
          // Handle any errors that occur during the fetch operation
          console.error('There was a problem with the fetch operation:', error);
      });
    }

  // Return the closest stations in pop up window 
  showPopup(closestStations);
 }


//popup for closest stations
function showPopup(closestStations) {
  // Generate the content for the popup
  let content = '';
  closestStations.forEach(station => {
    content += `
    <p>Station ID: ${station.station}, Station: ${station.name}, Distance: ${station.distance} m</p>
    <div class="dropdown">
      <button class="avgOccupancy">Average Occupancy</button>
      <div class="dropdown-content">
      <canvas id="occupancyChart-${station.station}" width="400" height="200"></canvas>
      </div>
    </div>
   
  `;
  });
 
  // Set the content of the popup
  document.getElementById('station-info').innerHTML = content;
 
  // Show the popup
  document.getElementById('popup-window').style.display = 'block';
 
  closestStations.forEach(station => {
    renderDummyOccupancyChart(station.station);
  });
}


 //! dummy data function for occupancy chart, to be changed if we have time 
 function renderDummyOccupancyChart(stationId) {
  const chartCanvas = document.getElementById(`occupancyChart-${stationId}`);
  const ctx = chartCanvas.getContext('2d');

  // Dummy data for average occupancy of available bikes by hour over a 7 day week
  const dummyOccupancyData = Array.from({ length: 7 }, () =>
    Math.floor(Math.random() * 31)
  );

  const data = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [{
      label: 'Average Occupancy',
      data: dummyOccupancyData,
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  const config = {
    type: 'line',
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  };

  console.log('Chart config:', config);
  try {
    new Chart(ctx, config); // Attempt to initialize the Chart object
    console.log('Chart initialized successfully');
  } catch (error) {
    console.error('Error initializing chart:', error);
  }
}

 //end of closest stations functions 

 //This function gets the route from point A to point B using cycling as mode of transport
 function GetRoute(sourceLat, sourceLng, destLat, destLng)
 {
   directionsRenderer.setMap(map);
 
   var start = new google.maps.LatLng(sourceLat, sourceLng);
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

 async function GetDistance(sourceLat, sourceLng, destLat, destLng)
 {
  var distanceResponse = await distanceService.getDistanceMatrix({
    origins: [new google.maps.LatLng(sourceLat, sourceLng)],
    destinations: [new google.maps.LatLng(destLat, destLng)], // customer address
    travelMode: 'BICYCLING',
    unitSystem: google.maps.UnitSystem.METRIC
  });

  return distanceResponse.rows[0].elements[0].distance.value;
 }

//journey planner functions start 

function FillStations(stationsData)
{
  const firstDropdown = document.getElementById("sourceDropdown");
  const secondDropdown = document.getElementById("destDropdown");

  for(let i=0; i< stationsData.length; i++)
  {
    let opt = document.createElement("option");
    opt.className = "travelOption";

    opt.value = stationsData[i].name;
    opt.text = stationsData[i].name;

    //adding to first menu
    firstDropdown.appendChild(opt);
  }
  
  //similar code for second dropdown menu
  for(let i=0; i< stationsData.length; i++)
  {
    let opt = document.createElement("option");
    opt.className = "travelOption";

    opt.value = stationsData[i].name;
    opt.text = stationsData[i].name;

    //adding to second menu
    secondDropdown.appendChild(opt);
  }

  //recording the source and destination
  firstDropdown.onchange = function(){
    source = firstDropdown.value;
  }

  secondDropdown.onchange = function(){
    destination = secondDropdown.value;
  }

  const showRouteButton = document.getElementById("showRoute");


  showRouteButton.addEventListener("click", ()=>{
    PlanJourney(source, destination, stationsData);
    // document.getElementById("travelForm").style.display = 'none';
    const travelForm = document.getElementById("travelForm");
    travelForm.style.display = 'block';
    const journeyDetails = document.getElementById("journey-details");
    travelForm.appendChild(journeyDetails);
  });
}

async function PlanJourney(source, destination, stationsData)
{
  var sourceLat, sourceLng, destLat, destLng;

  for(let i=0 ; i< stationsData.length; i++)
  {
    if(source == stationsData[i].name && source!= "Source")
    {
      sourceLat = stationsData[i].position_lat;
      sourceLng = stationsData[i].position_lng;
    }

    if(destination == stationsData[i].name && destination != "Destination") 
    {
      destLat = stationsData[i].position_lat;
      destLng = stationsData[i].position_lng;
    }
  }

  //we will get the route only when we have both locations
  if(sourceLat && sourceLng && destLat && destLng)
  {
    GetRoute(sourceLat, sourceLng, destLat, destLng);

    // Get information from info window for both source and destination
    const sourceInfo = await getInfoWindowContent(source, stationsData);
    const destInfo = await getInfoWindowContent(destination, stationsData);

    // Show journey details including info window content
    showJourneyDetails(sourceInfo, destInfo, stationsData);
  }
}


// Function to get info window content for a station
async function getInfoWindowContent(stationName, stationsData) {
  for (let i = 0; i < stationsData.length; i++) {
    if (stationName == stationsData[i].name) {
      const response = await GetOccupancyData(stationsData[i].number)
      
      let id = stationsData[i].number;
      let result = [id, response];  
      
      return result;
    }
  }
}




//predict bike availability function 
async function predictAvailability(selectedHour, stationid) {
  
  let hours = selectedHour; // this works
 

  try {
    // Fetch weather data
    const responseWeather = await fetch('/weather', {
      method: 'POST', // Send a POST request
      headers: {
        'Content-Type': 'application/json' // Specify content type as JSON
      },
      body: JSON.stringify({}) // Send an empty body since you don't seem to be passing any data
    });
    
    if (!responseWeather.ok) {
      throw new Error('Network response for weather data was not ok');
    }

    const weatherData = await responseWeather.json();

    var temp_c = parseFloat(weatherData.temp_c);
    var wind_mph = parseFloat(weatherData.wind_mph);
    var precip_mm = parseFloat(weatherData.precip_mm);

    var requestData = {
      stationid: stationid,
      temp_c: temp_c,
      wind_mph: wind_mph,
      precip_mm: precip_mm,
      hours: hours
    };
    
    // calling prediction
    const responsePrediction = await fetch(`/predict/${stationid}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });
    
    if (!responsePrediction.ok) {
      throw new Error('Network response for prediction fetch was not ok');
    }

    const data = await responsePrediction.json();
    console.log('Predicted Bikes: ', data);
    return data; // returning predicted bikes

  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}




// Function to show journey details including info window content and predict button
async function showJourneyDetails(sourceInfo, destInfo, stationsData) {
  const journeyDetails = document.getElementById("journey-details");
 const hoursDropdown = (hour) => `<select id="hoursInput${hour}">${Array.from({length: 24}, (_, i) => `<option value="${i}">${i.toString().padStart(2, '0')}</option>`).join('')}</select>`;

console.log(sourceInfo);
console.log(destInfo);

const sourceID = sourceInfo[0]; // Extracting the id from sourceInfo
const sourceData = sourceInfo[1];

const destID = destInfo[0]; 
const destData = destInfo[1];

let sourceName = "Unknown";
let destName = "Unknown";

// Find source station name by ID
for (let i = 0; i < stationsData.length; i++) {
  if (sourceID === stationsData[i].number) {
    sourceName = stationsData[i].name;
    break; // No need to continue searching once found
  }
}

// Find destination station name by ID
for (let i = 0; i < stationsData.length; i++) {
  if (destID === stationsData[i].number) {
    destName = stationsData[i].name;
    break; // No need to continue searching once found
  }
}


 journeyDetails.innerHTML = `
 <h2>Journey Details</h2>
 <div style="display: flex; justify-content: space-between;">
   <div>
     <h3>Start Point: ${sourceName}</h3>
     <p>ID: ${sourceID}</p> <!-- Displaying the id -->
     <!-- Displaying the sourceData -->
     <p>Available Bikes: ${sourceData[0]}</p>
     <p>Available Bike Stands: ${sourceData[1]}</p>
     </div>
   </div>
   <div>
     <h3>End Point: ${destName}</h3>
     <p>ID: ${destID}</p> <!-- Displaying the id -->
     <!-- Displaying the sourceData -->
     <p>Available Bikes: ${destData[0]}</p>
     <p>Available Bike Stands: ${destData[1]}</p>
     </div>
 </div>
 <div style="display: flex; justify-content: space-between;">
   <div>
     <h3>Predict Available Bikes at ${sourceName}</h3>
     ${hoursDropdown('Source', '')}
     <button id="predictButtonSource">Predict Bikes</button>
     <span id="predictedBikesSource">Loading...</span>
   </div>
   <div>
     <h3>Predict Available Bikes at ${destName}</h3>
     ${hoursDropdown('Destination', '')}
     <button id="predictButtonDestination">Predict Bikes</button>
     <span id="predictedBikesDestination">Loading...</span>
   </div>
 </div>
`;

// Event listener for the "Predict Bikes" button at the source station
document.getElementById("predictButtonSource").addEventListener('click', async function() {
  var selectedHour = document.getElementById("hoursInputSource").value;
  var stationid = sourceInfo[0]
  try {
    const predictionResult = await predictAvailability(selectedHour, stationid);
    const roundedAvailability = Math.floor(predictionResult.availability); // Corrected variable name
    document.getElementById("predictedBikesSource").innerText = `Predicted Bikes: ${roundedAvailability} bikes at ${selectedHour}:00`;
  } catch (error) {
    console.error('Error predicting bikes:', error);
    document.getElementById("predictedBikesSource").innerText = 'Error predicting bikes';
  }
});

 
 // Event listener for the "Predict Bikes" button at the destination station
 document.getElementById("predictButtonDestination").addEventListener('click', async function() {
  var selectedHour = document.getElementById("hoursInputDestination").value;
  var stationid = destInfo[0];
  document.getElementById("predictedBikesDestination").innerText = 'Loading...'; // Show loading message
  try {
    const predictionResult = await predictAvailability(selectedHour, stationid);
    const predictedAvailability = Math.floor(predictionResult.availability);
    document.getElementById("predictedBikesDestination").innerText = `Predicted Bikes: ${predictedAvailability} bikes at ${selectedHour}:00`; // Update with predicted availability
  } catch (error) {
    console.error('Error predicting bikes:', error);
    document.getElementById("predictedBikesDestination").innerText = 'Error predicting bikes';
  }
});
}
//end of prediction function & listener 
