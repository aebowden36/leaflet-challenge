var myMap = L.map("map", {
    center: [40.76, -10.89],
    zoom: 2
});

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"

var mapStyle = 
d3.json(link).then(function(data){
    L.geoJson(data, {
        pointToLayer: function(features, latlng) {
            return L.circleMarker(latlng, {
                color: "black",
                radius: features.properties.mag*2,
                fillColor: getColor(latlng.alt),
                fillOpacity: 0.65,
                weight: 0.5
            }).bindPopup(function(data) {
                return `${features.properties.place}<br>Magnitude: ${features.properties.mag}`;
            })
        }
    }).addTo(myMap);
});

function getColor(depth) {
    switch (true){
        case depth > 90:
            return "purple";

        case depth > 70:
            return "blue"

        case depth > 50:
            return "red"

        case depth > 30:
            return "orange"

        case depth > 10:
            return "yellow"

        case depth < 11:
            return "green"
    }
};

var legend = L.control({position:"bottomright"});
legend.onAdd = function(){
    var div = L.DomUntil.create("div", "info legend");
    var grade = [-10,10,30,50,70,90];
    var labels = []

    for (var i = 0; i<grade.length; i++){
        div.innerHTML += '<i style="background:' + getColor(grade[i]+1) + '"></i>' + grade[i] + (grade[i])+ (grade[i + 1] ? "&ndash;" + grade[i + 1] + "<br>" : "+");
    }
    return div;
};
legend.addTo(myMap);