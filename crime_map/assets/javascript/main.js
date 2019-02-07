// console.log(geoJson);


$(document).on("click", "#add-input", function() {

  zipCode = $("#user-input").val();

  console.log("zipcode:" + zipCode);

  zipCodeItem = getZipcodeItem();
  swappedArray = getCoordinates(zipCodeItem.geometry);

  function callSeattleData() { //Performing an AJAX request with the queryURL
    $.ajax({
      url: "https://data.seattle.gov/resource/4fs7-3vj5.json",
      type: "GET",
      data: {
        "$limit": 50,
        "$$app_token": "6NFQsiYRtqSHKDwDVifkcJEqk"
      }
    }).done(function(data) {
      console.log(data);

      for (var i = 0; i < data.length; i++) {

        console.log(data[i].crime_description);
        console.log(data[i].neighborhood);
      }
    });
  }
  callSeattleData();

  $('#user-input').val('');

  app.updateMap();
  app.initLayers();
  app.layerChanged(layerId, active);

});


function getZipcodeItem() {
  var out;
  geoJson.features.forEach(function(zipCodeItem) {
    //console.log(zipCodeItem.properties.GEOID10 + '===' + zipCode);
    if (zipCodeItem.properties.GEOID10 === zipCode) {
      out = zipCodeItem;
    }
  });
  return out;
}

function getCoordinates(geometry) {
  var swappedArray = [];

  for (var i = 0; i < geometry.coordinates[0].length; i++) {

    swappedArray.push([
      geometry.coordinates[0][i][1],
      geometry.coordinates[0][i][0]
    ]);
  }
  return swappedArray;
}

// function callSeattleData() { //Performing an AJAX request with the queryURL
//   $.ajax({
//     url: "https://data.seattle.gov/resource/4fs7-3vj5.json",
//     type: "GET",
//     data: {
//       "$limit": 50,
//       "$$app_token": "6NFQsiYRtqSHKDwDVifkcJEqk"
//     }
//   }).done(function(data) {
//     console.log(data);
//
//     for (var i = 0; i < data.length; i++) {
//       if (){
//
//       }
//
//       console.log(data[i].crime_description);
//       console.log(data[i].neighborhood);
//     }
//   });
// }

var zipCode = "98101";
var zipCodeItem = getZipcodeItem();
var swappedArray = getCoordinates(zipCodeItem.geometry);


const app = new Vue({
      el: '#app',
      data: { /* Data properties will go here */
        map: null,
        tileLayer: null,
        layers: [{
          id: 0,
          name: 'Restaurants',
          active: false,
          features: [{
              id: 0,
              name: 'Bogart\'s Smokehouse',
              type: 'marker',
              coords: [47.6109607, -122.3050322],
            },
            {
              id: 1,
              name: 'Pappy\'s Smokehouse',
              type: 'marker',
              coords: [47.6350008, -122.3261532],
            },
            {
              id: 2,
              name: 'Broadway Oyster Bar',
              type: 'marker',
              coords: [47.6188362, -122.3947098],
            },
            {
              id: 3,
              name: 'Charlie Gitto\'s On the Hill',
              type: 'marker',
              coords: [47.617972, -122.3756436],
            },
            {
              id: 4,
              name: 'Sugarfire',
              type: 'marker',
              coords: [47.6304077, -122.3916921],
            },
            {
              id: 5,
              name: 'The Shaved Duck',
              type: 'marker',
              coords: [47.6036282, -122.3381407],
            },
            {
              id: 6,
              name: 'Mango Restaurant',
              type: 'marker',
              coords: [47.6313642, -122.3961267],
            },
            {
              id: 7,
              name: 'Zia\'s Restaurant',
              type: 'marker',
              coords: [47.6157376, -122.37716],
            },
            {
              id: 8,
              name: 'Anthonio\'s Taverna',
              type: 'marker',
              coords: [47.6143846, -122.380048],
            },
          ],
        }, ],
      },
      mounted() { /* Code to run when app is mounted */
        this.initMap();
        this.initLayers();
      },

      methods: { /* Functions for for the map object */

        initMap() { //sets the lat/long and zoom level at document load
          this.map = L.map('map').setView([47.6097, -122.3331], 12);
          this.tileLayer = L.tileLayer(
            'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png', {
              maxZoom: 18,
              attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
            }
          );
          this.tileLayer.addTo(this.map);
          var polygon = L.polygon(swappedArray, {
            color: 'red'
          }).addTo(this.map);
          this.map.fitBounds(polygon.getBounds());
        },
        updateMap() {
          var polygon = L.polygon(swappedArray, {
            color: 'red'
          }).addTo(this.map);
          this.map.fitBounds(polygon.getBounds());
        },
        initLayers() {
          this.layers.forEach((layer) => {
            // Initialize the layer
            const markerFeatures = layer.features.filter(feature => feature.type === 'marker');
            const polygonFeatures = layer.features.filter(feature => feature.type === 'polygon');
            markerFeatures.forEach((feature) => {
              feature.leafletObject = L.marker(feature.coords)
                .bindPopup(feature.name);
            });
            polygonFeatures.forEach((feature) => {
              feature.leafletObject = L.polygon(feature.coords)
                .bindPopup(feature.name);
            });
          });
        },
        layerChanged(layerId, active) {
      /* Show or hide the features in the layer */
      const layer = this.layers.find(layer => layer.id === layerId);
      layer.features.forEach((feature) => {
        /* Show or hide the feature depending on the active argument */
        if (active) {
          feature.leafletObject.addTo(this.map);
        } else {
          feature.leafletObject.removeFrom(this.map);
        }
      });
    },
  },
});
