function createMap(divId, Map, popData00, popData10, ageData00, ageData10) {
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

  var columnData = d3.map();
  console.log(Map)
  Map.features.forEach(function(d){
    console.log(d.properties.name.trim());
    columnData.set(d.properties.name.trim(), 0);
  })

  var states = svg.append("g")
    .selectAll("path")
    .data(Map.features)
    .enter().append("path")
    .attr("d", path );
}
function processData(errors, Map, popData00, popData10, ageData00, ageData10) {
  
  console.log(errors)
  createMap("#PopMap", Map, popData00, popData10, ageData00, ageData10);
}

queue()
  .defer(d3.json, "https://raw.githubusercontent.com/leoncaoyc/China_Population/master/china.geojson")
  .defer(d3.json, "https://raw.githubusercontent.com/leoncaoyc/China_Population/master/00pop.json")
  .defer(d3.json, "https://raw.githubusercontent.com/leoncaoyc/China_Population/master/10pop.json")
  .defer(d3.json, "https://raw.githubusercontent.com/leoncaoyc/China_Population/master/00age.json")
  .defer(d3.json, "https://raw.githubusercontent.com/leoncaoyc/China_Population/master/10age.json")
  .await(processData);

