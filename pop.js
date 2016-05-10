function createMap(divId, Map, popData00, popData10) {
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
  popData10.forEach(function(d){
    if (d.地区!="全国"){
      columnData.set(d.地区,  Number(d.人口数));
    }
  });
  var colExtent10 = d3.extent(columnData.values());
  popData00.forEach(function(d){
    if (d.地区!="全国"){
      columnData.set(d.地区,  Number(d.人口数));
    }
  });
  columnData.set("台湾",23360000);
  var colExtent00 = d3.extent(columnData.values());
  var colExtent = d3.extent(colExtent00.concat(colExtent10));
  console.log(colExtent);

  var color = d3.scale.linear()
    .domain(colExtent)
    .range(["rgb(254,224,210)", "rgb(222,45,38)"])
    .interpolate(d3.interpolateHcl);

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([0, 0])
    .html(function(d) {
      return "State: "+d.properties.name+"  Population: "+getpop(d.properties.name, popData00);
    });

  svg.call(tip);

  var states = svg.append("g")
    .selectAll("path")
    .data(Map.features)
    .enter().append("path")
    .attr("d", path )
    .attr("class", "state-boundary")
    .style("fill", function(d) {
        return color(columnData.get(d.properties.name));
      })
    .on('mouseover', function(d,i){
        tip.show(d,i);
      })
    .on('mouseout', function(d,i){
        tip.hide(d,i);
      });

    var pop00_click = d3.select("#pop00").on('click',function(){
      MapUpdata("#PopMap", Map, popData00, 0, colExtent);
    });
    var pop10_click = d3.select("#pop10").on('click',function(){
      MapUpdata("#PopMap", Map, popData10, 1, colExtent);
    });
}

function MapUpdata(divId, Map, Data, year, colExtent){
  var columnData = d3.map();
  Data.forEach(function(d){
    if (d.地区!="全国"){
      columnData.set(d.地区,  Number(d.人口数));
    }
  });
  columnData.set("台湾",23360000);
  var color = d3.scale.linear()
    .domain(colExtent)
    .range(["rgb(254,224,210)", "rgb(222,45,38)"])
    .interpolate(d3.interpolateHcl);
  var svg = d3.select(divId).select("svg").select("g");
  var update = svg.selectAll("path").data(Map.features)
  update
  .attr("class", "state-boundary")
  .style("fill", function(d) {
      return color(columnData.get(d.properties.name));
    });
}

function getpop(name, popdata){
  var s;
  popdata.forEach(function(d){
    if(d.地区==name){
      console.log (name+1);
      s=d.人口数;
    }
  })
  return s;
}

function processData(errors, Map, popData00, popData10, ageData00, ageData10) {
  createMap("#PopMap", Map, popData00, popData10);
}
queue()
  .defer(d3.json, "https://raw.githubusercontent.com/leoncaoyc/China_Population/master/china.geojson")
  .defer(d3.json, "https://raw.githubusercontent.com/leoncaoyc/China_Population/master/00pop.json")
  .defer(d3.json, "https://raw.githubusercontent.com/leoncaoyc/China_Population/master/10pop.json")
  .defer(d3.json, "https://raw.githubusercontent.com/leoncaoyc/China_Population/master/00age.json")
  .defer(d3.json, "https://raw.githubusercontent.com/leoncaoyc/China_Population/master/10age.json")
  .await(processData);
