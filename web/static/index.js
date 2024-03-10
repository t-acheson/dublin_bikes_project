let map;
var lat, lng;
async function initMap() {

  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  if(navigator.geolocation)
  {
    navigator.geolocation.getCurrentPosition((position)=>{
      lat = parseFloat(position.coords.latitude);
      lng = parseFloat(position.coords.longitude);
    }, null, options);
  }
  else
  {
    lat = 53.3498;
    lng = -6.2603;
  }

  const map = new google.maps.Map(document.getElementById("map"), {
    
    center: { lat:lat, lng:lng},
    zoom: 13,
    disableDefaultUI: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_CENTER
    },
    styles: [
    {
      "featureType": "all",
      "elementType": "labels.text.fill",
      "stylers": [{"color": "#ffffff"}]
    },
    {
      "featureType": "all",
      "elementType": "labels.text.stroke",
      "stylers": [{"color": "#000000"},{"lightness": 13}]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry.fill",
      "stylers": [{"color": "#000000"}]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry.stroke",
      "stylers": [{"color": "#144b53"},{"lightness": 14},{"weight": 1.4}]
    },
    {
      "featureType": "landscape",
      "elementType": "all",
      "stylers": [{"color": "#08304b"}]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [{"color": "#0c4152"},{"lightness": 5}]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.fill",
      "stylers": [{"color": "#000000"}]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [{"color": "#0b434f"},{"lightness": 25}]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry.fill",
      "stylers": [{"color": "#000000"}]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry.stroke",
      "stylers": [{"color": "#0b3d51"},{"lightness": 16}]
    },
    {
      "featureType": "road.local",
      "elementType": "geometry",
      "stylers": [{"color": "#000000"}]
    },
    {
      "featureType": "transit",
      "elementType": "all",
      "stylers": [{"color": "#146474"}]
    },
    {
      "featureType": "water",
      "elementType": "all",
      "stylers": [{"color": "#021019"}]
    }]
    
  });

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
  });

  //marker for current location
  new google.maps.Marker({
    position: {lat: lat, lng: lng},
    map:map,
    icon: {
      url: 'https://img.icons8.com/color/48/marker--v1.png',
      scaledSize: new google.maps.Size(35, 35),
    }
  });  

  //marker for bike station locations
  for(var i=0; i< stationsData.length; i++)
  {
    const marker = new google.maps.Marker({
      position: stationsData[i].position,
      map,
      icon:{
        url:"https://img.icons8.com/stickers/100/electric-bike.png",
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
    <p class="info">Banking: ${markerData.banking ? "yes":"no"}</p>
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

async function GetStationsData()
{
  const bikePromise = await fetch("https://api.jcdecaux.com/vls/v1/stations?contract=dublin&apiKey=9923c4b16f8c5fd842f2f448564bed43a349fa47", {mode:"cors"})
  bikesData = await bikePromise.json(); 
  return bikesData;
}

async function GetWeatherData()
{
  const weatherPromise = await fetch("http://api.weatherapi.com/v1/current.json?key=0f5a8ade5f024e70a34123035241602&q=dublin",{mode:"cors"});
  wData = await weatherPromise.json();
  return wData;
}

initMap();
setInterval(()=>initMap(),120000);