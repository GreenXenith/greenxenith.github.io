
var map = L.map("map", {
	crs: L.CRS.Simple,
	attributionControl: true,
	maxBounds: [[0,0],[12,12]],
});

L.tileLayer("", {
	minZoom: 6,
	maxZoom: 10,
}).addTo(map);

var bounds = [[0,0], [12,12]];
var image = L.imageOverlay("assets/rpmap.png", bounds).addTo(map);

map.fitBounds(bounds);

var markers = [];
var poi = [
	{x: 648, y: 292, text: "Forrest's House"},
	{x: 648, y: 284, text: "Jorge's House"},
	{x: 710, y: 314, text: "Guild Hall"},
	{x: 724, y: 287, text: "Guild Stables"},
	{x: 703, y: 288, text: "Guild Training"},
	{x: 684, y: 250, text: "Docks"},
	{x: 510, y: 340, text: "Cleavewood Forest"},
	{x: 415, y: 400, text: "Newberg Castle"},
]
poi.sort(function(a, b) {return a.y - b.y});

for (var i = 0; i < poi.length; i++) {
	var data = poi[i]
	var m = 12 / 896;
	var marker = L.popup({
		closeOnClick: false,
		autoClose: false,
	}).setLatLng([12 - m * data.y, m * data.x]).setContent(data.text).openOn(map);
	markers.push(marker)
}

var layers = L.layerGroup(markers);
layers.addTo(map);

L.control.layers({}, {"Markers": layers}).addTo(map);
