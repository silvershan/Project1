console.log(geoJson);


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

function getCoordinates(geometry){
  var swappedArray = [];
  
  for (var i = 0; i < geometry.coordinates[0].length; i++){
    //console.log(geometry.coordinates[i]);
    // var aux = geometry.coordinates[i][0];
    // geometry.coordinates[i][0] = geometry.coordinates[i][1];
    // geometry.coordinates[i][1] = aux;
    swappedArray.push([
      geometry.coordinates[0][i][1],
      geometry.coordinates[0][i][0]
    ]);
  }
  return swappedArray;
}
var zipCode = "98136";
var zipCodeItem = getZipcodeItem();
var swappedArray = getCoordinates(zipCodeItem.geometry);

console.log(getCoordinates(zipCodeItem.geometry));






new Vue({
  el: '#app',
  data: { /* Data properties will go here */
    map: null,
    tileLayer: null
    // 
  },
  mounted() { /* Code to run when app is mounted */
    this.initMap();
    this.callSeattleData()
  },

  //var type = $(this).attr("data-name"); //creates a variable for the data-type attribute (value of each array item) for each button
  //console.log(type);


  methods: { /* Functions for for the map object */

    callSeattleData() { //Performing an AJAX request with the queryURL
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
          // console.log(data[i].go_number);
          // console.log(data[i].crime_description);
          // console.log(data[i].neighborhood);
        }
      });
    },

    initMap() { //sets the lat/long and zoom level at document load
      this.map = L.map('map').setView([47.6097, -122.3331], 12);
      this.tileLayer = L.tileLayer(
        'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
        }
      );
      this.tileLayer.addTo(this.map);
      var polygon = L.polygon(swappedArray, {color: 'red'}).addTo(this.map);
      this.map.fitBounds(polygon.getBounds());
    },
  },
});
