function createMap(divId, Map) {
  var width = 1000;
  var height = 1000;

  var svg = d3.select(divId).append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", "translate(0,0)");

  var projection = d3.geo.mercator()
    .center([107, 31])
    .scale(850)
    .translate([width / 2, height / 2]);

  var path = d3.geo.path()
    .projection(projection);

  var states = svg.append("g")
    .selectAll("path")
    .data(Map.features)
    .enter().append("path")
    .attr("d", path );
}
function processData(errors, Map) {
  createMap("#map", Map);
}

queue()
  .defer(d3.json, "https://raw.githubusercontent.com/leoncaoyc/World-population/master/china.geojson")
  .await(processData);

