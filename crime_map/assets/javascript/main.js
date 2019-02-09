// console.log(geoJson);


$(document).on("click", "#add-input", function() {

  zipCode = $("#user-input").val();

  console.log("zipcode:" + zipCode);

  zipCodeItem = getZipcodeItem();
  swappedArray = getCoordinates(zipCodeItem.geometry);

  $('#user-input').val('');

  app.updateMap();
  app.initLayers();

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

function validateZipCode(elementValue){
    var zipCodePattern = ("/^\d{5}$|^\d{5}-\d{4}$/");
    return zipCodePattern.test(elementValue);
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
        name: 'Elementary',
        active: true,
        features: [{
            id: 1000000000,
            name: 'Bogart\'s Smokehouse',
            type: 'marker',
            coords: [47.6109607, -122.3050322],
          },

        ],
      },
      {
        id: 1,
        name: 'Middle School',
        active: true,
        features: [],
      },
      {
        id: 2,
        name: 'High School',
        active: true,
        features: [],
      }, {
        id: 3,
        name: 'Option Elementary',
        active: true,
        features: [],
      }, {
        id: 4,
        name: 'Option High School',
        active: true,
        features: [],
      },
      {
        id: 5,
        name: 'Non Standard',
        active: true,
        features: [],
      },
    ],
  },
  mounted() { /* Code to run when app is mounted */
    this.callSchoolData();
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
      })
    },
    callSchoolData() { //Performing an AJAX request with the queryURL
      $.ajax({
        url: "https://gisdata.seattle.gov/server/rest/services/COS/COS_Public_Facilities_and_Safety/MapServer/8/query?where=1%3D1&outFields=*&outSR=4326&f=json",
        type: "GET",

      }).done(function(data) {
        //console.log(data);
        for (var i = 0; i < app._data.layers.length; i++) {
          //console.log(app._data.layers[i]);
          // console.log(app._data.layers[i].features);
          // console.log(app.layers[i].name);

          if (app.layers[i].name === "Elementary") {

            for (var j = 0; j < data.features.length; j++) {
              //console.log(data.features[i]);
              //console.log(data.features[i].attributes.TYPE);

              if (data.features[j].attributes.TYPE === "Elementary") {
                //console.log(app._data.layers[i].features);
                app._data.layers[i].features.push({
                  id: data.features[j].attributes.OBJECTID,
                  name: data.features[j].attributes.SCHOOL,
                  grade: data.features[j].attributes.TYPE,
                  type: 'marker',
                  coords: [data.features[j].geometry.y, data.features[j].geometry.x],
                })
              }
            }
          } else if (app.layers[i].name === "Middle School") {

            for (var j = 0; j < data.features.length; j++) {
              //console.log(data.features[i]);
              //console.log(data.features[i].attributes.TYPE);

              if (data.features[j].attributes.TYPE === "Middle School") {

                app._data.layers[i].features.push({
                  id: data.features[j].attributes.OBJECTID,
                  name: data.features[j].attributes.SCHOOL,
                  grade: data.features[j].attributes.TYPE,
                  type: 'marker',
                  coords: [data.features[j].geometry.y, data.features[j].geometry.x],
                })
              }
            }
          } else if (app.layers[i].name === "High School") {

            for (var j = 0; j < data.features.length; j++) {
              //console.log(data.features[i]);
              //console.log(data.features[i].attributes.TYPE);

              if (data.features[j].attributes.TYPE === "High School") {
                // console.log(app._data.layers[i].features);
                app._data.layers[i].features.push({
                  id: data.features[j].attributes.OBJECTID,
                  name: data.features[j].attributes.SCHOOL,
                  grade: data.features[j].attributes.TYPE,
                  type: 'marker',
                  coords: [data.features[j].geometry.y, data.features[j].geometry.x],
                })
              }
            }
          } else if (app.layers[i].name === "Option Elementary") {

            for (var j = 0; j < data.features.length; j++) {
              //console.log(data.features[i]);
              //console.log(data.features[i].attributes.TYPE);

              if (data.features[j].attributes.TYPE === "Option Elementary") {
                // console.log(app._data.layers[i].features);
                app._data.layers[i].features.push({
                  id: data.features[j].attributes.OBJECTID,
                  name: data.features[j].attributes.SCHOOL,
                  grade: data.features[j].attributes.TYPE,
                  type: 'marker',
                  coords: [data.features[j].geometry.y, data.features[j].geometry.x],
                })
              }
            }
          } else if (app.layers[i].name === "Option High School") {

            for (var j = 0; j < data.features.length; j++) {
              //console.log(data.features[i]);
              //console.log(data.features[i].attributes.TYPE);

              if (data.features[j].attributes.TYPE === "Option High School") {
                // console.log(app._data.layers[i].features);
                app._data.layers[i].features.push({
                  id: data.features[j].attributes.OBJECTID,
                  name: data.features[j].attributes.SCHOOL,
                  grade: data.features[j].attributes.TYPE,
                  type: 'marker',
                  coords: [data.features[j].geometry.y, data.features[j].geometry.x],
                })
              }
            }
          } else if (app.layers[i].name === "Non Standard") {

            for (var j = 0; j < data.features.length; j++) {
              //console.log(data.features[i]);
              //console.log(data.features[i].attributes.TYPE);

              if (data.features[j].attributes.TYPE === "NonStandard") {
                // console.log(app._data.layers[i].features);
                app._data.layers[i].features.push({
                  id: data.features[j].attributes.OBJECTID,
                  name: data.features[j].attributes.SCHOOL,
                  grade: data.features[j].attributes.TYPE,
                  type: 'marker',
                  coords: [data.features[j].geometry.y, data.features[j].geometry.x],
                })
              }
            }
          }
        }
      })
    },
  }
});
