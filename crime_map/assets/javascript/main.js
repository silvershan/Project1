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
              id: '',
              name: '',
              grade: '',
              type: 'marker',
              coords: [],
            }, ],
          },
          {
            id: 1,
            name: 'Middle School',
            active: true,
            features: [{
              id: '',
              name: '',
              grade: '',
              type: 'marker',
              coords: [],
            }, ],
          },
          {
            id: 2,
            name: 'High School',
            active: true,
            features: [{
              id: '',
              name: '',
              grade: '',
              type: 'marker',
              coords: [],
            }, ],
          }, {
            id: 3,
            name: 'Option Elementary',
            active: true,
            features: [{
              id: '',
              name: '',
              grade: '',
              type: 'marker',
              coords: [],
            }, ],
          }, {
            id: 4,
            name: 'Option High School',
            active: true,
            features: [{
              id: '',
              name: '',
              grade: '',
              type: 'marker',
              coords: [],
            }, ],
          },
          {
            id: 5,
            name: 'Non Standard',
            active: true,
            features: [{
              id: '',
              name: '',
              grade: '',
              type: 'marker',
              coords: [],
            }, ],
          },
        ],
      },
      mounted() { /* Code to run when app is mounted */
        this.initMap();
        this.initLayers();
        this.callSchoolData();
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
        callSchoolData() { //Performing an AJAX request with the queryURL
          $.ajax({
              url: "https://gisdata.seattle.gov/server/rest/services/COS/COS_Public_Facilities_and_Safety/MapServer/8/query?where=1%3D1&outFields=*&outSR=4326&f=json",
              type: "GET",

            }).done(function(data) {
                console.log(data);

                for (var i = 0; i < data.features.length; i++) {

                  // var schoolFeatures = [{
                  //   id: data.features[i].attributes.OBJECTID,
                  //   name: data.features[i].attributes.SCHOOL,
                  //   grade: data.features[i].attributes.TYPE,
                  //   type: 'marker',
                  //   coords: [data.features[i].geometry.y, data.features[i].geometry.x],
                  // }, ];

                  //console.log(app.layers);
                  if (data.features[i].attributes.TYPE === "Elementary") {
                    app.layers.push(
                      {
                        id: data.features[i].attributes.OBJECTID,
                        name: data.features[i].attributes.SCHOOL,
                        grade: data.features[i].attributes.TYPE,
                        type: 'marker',
                        coords: [data.features[i].geometry.y, data.features[i].geometry.x],
                      }
                    )
                  } else if (data.features[i].attributes.TYPE === "Middle School") {
                      app.layers.push(
                        {
                          id: data.features[i].attributes.OBJECTID,
                          name: data.features[i].attributes.SCHOOL,
                          grade: data.features[i].attributes.TYPE,
                          type: 'marker',
                          coords: [data.features[i].geometry.y, data.features[i].geometry.x],
                        }
                      )
                    } else if (data.features[i].attributes.TYPE === "High School") {
                        app.layers.push(
                          {
                            id: data.features[i].attributes.OBJECTID,
                            name: data.features[i].attributes.SCHOOL,
                            grade: data.features[i].attributes.TYPE,
                            type: 'marker',
                            coords: [data.features[i].geometry.y, data.features[i].geometry.x],
                          }
                        )
                      } else if (data.features[i].attributes.TYPE === "Option Elementary") {
                          app.layers.push(
                            {
                              id: data.features[i].attributes.OBJECTID,
                              name: data.features[i].attributes.SCHOOL,
                              grade: data.features[i].attributes.TYPE,
                              type: 'marker',
                              coords: [data.features[i].geometry.y, data.features[i].geometry.x],
                            }
                          )
                        } else if (data.features[i].attributes.TYPE === "Option High School") {
                            app.layers.push(
                              {
                                id: data.features[i].attributes.OBJECTID,
                                name: data.features[i].attributes.SCHOOL,
                                grade: data.features[i].attributes.TYPE,
                                type: 'marker',
                                coords: [data.features[i].geometry.y, data.features[i].geometry.x],
                              }
                            )
                          } else if (data.features[i].attributes.TYPE === "NonStandard") {
                              app.layers.push(
                                {
                                  id: data.features[i].attributes.OBJECTID,
                                  name: data.features[i].attributes.SCHOOL,
                                  grade: data.features[i].attributes.TYPE,
                                  type: 'marker',
                                  coords: [data.features[i].geometry.y, data.features[i].geometry.x],
                                }
                              )
                            };



                            // console.log(data.features[i].attributes.SCHOOL);
                            // console.log(data.features[i].attributes.TYPE);
                            // console.log(data.features[i].geometry.x);
                            // console.log(data.features[i].geometry.y);

                          }
                        });
                    }
                  },
                });
