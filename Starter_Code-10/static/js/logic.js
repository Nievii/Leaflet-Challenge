// Create a map 
var myMap = L.map("map", {
    center: [0, 0],
    zoom: 2,
  });
  
// Title layer 
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(myMap);
  
  // Function marker size based on earthquake magnitude
  function markerSize(magnitude) {
    return magnitude * 6; // 
  }
  
  // Function marker color on earthquake depth
  function getColor(depth) {
    return depth > 90 ? "#FF0000" :
           depth > 70 ? "#FF4500" :
           depth > 50 ? "#FF8C00" :
           depth > 30 ? "#FFD700" :
           depth > 10 ? "#ADFF2F" :
                        "#008000";
  }
  
  
  var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  // Create markers on data 
  d3.json(url).then(function (data) {
     L.geoJSON(data.features, {
       pointToLayer: function (feature, latlng) {
         return L.circleMarker(latlng, {
           radius: markerSize(feature.properties.mag)*0.6,
           fillColor: getColor(feature.geometry.coordinates[2]),
           color: "#000",
           weight: 1,
           opacity: 1,
           fillOpacity: 0.8,
         });
       },
       onEachFeature: function (feature, layer) {
         layer.bindPopup("<h3>" + feature.properties.place +
           "</h3><hr><p>Magnitude: " + feature.properties.mag +
           "<br>Depth: " + feature.geometry.coordinates[2] + "</p>");
       },
     }).addTo(myMap);
  
  // Create a legend
  var legend = L.control({ position: "bottomleft" });
     legend.onAdd = function () {
         var div = L.DomUtil.create("div", "info legend");
         var depths = [0, 10, 30, 50, 70, 90];
  
         div.innerHTML += '<h4>Earthquake Depth Legend</h4>';

         for (var i = 0; i < depths.length; i++) {
             div.innerHTML +=
             '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
             depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km');
          }

          return div;
     };
     legend.addTo(myMap);
   });