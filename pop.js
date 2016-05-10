function createMap(divId, Map, popData00, popData10) {
  var width = 1000;
  var height = 1000;
  var sign=0;

  var svg = d3.select(divId).append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", "translate(0,0)");

  var svg1=d3.select("#barchart").append("svg")
    .attr("width", 400)
    .attr("height", height);

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

  var color = d3.scale.linear()
    .domain(colExtent)
    .range(["rgb(254,224,210)", "rgb(222,45,38)"])
    .interpolate(d3.interpolateHcl);

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([0, 0])
    .html(function(d) {
      if (sign==0){
        return "State: "+d.properties.name+"  Population: "+getpop(d.properties.name, popData00);
      } else {
        return "State: "+d.properties.name+"  Population: "+getpop(d.properties.name, popData10);
      }
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
        d3.select(this)
          .classed("highlight", true);
      })
    .on('mouseout', function(d,i){
        tip.hide(d,i);
        d3.select(this)
          .classed("highlight", false);
      })
    .on('click', function(d,i){
        var bardata=[Number(getpop(d.properties.name, popData00)),Number(getpop(d.properties.name, popData10))];
        createBarchart(bardata, colExtent);
      });

  var pop00_click = d3.select("#pop00").on('click',function(){
    sign=0;
    MapUpdata("#PopMap", Map, popData00, 0, colExtent);
  });
  var pop10_click = d3.select("#pop10").on('click',function(){
    sign=1;
    MapUpdata("#PopMap", Map, popData10, 1, colExtent);
  });
}

function createBarchart(bardata, col){
  var svg=d3.select("#barchart").select("svg");
  var rect = svg.selectAll("rect");
  var updata = rect.data(bardata);
  var enter = updata.enter();
  var yscale = d3.scale.linear().domain([(col[1]),col[0]]).range([0,500]);
  var y = d3.scale.linear().domain([(col[1]/1000000),col[0]/1000000]).range([0,500]);
  var xAxis = d3.svg.axis().scale(y).orient("left");

  svg.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(" + 100 + "," + 100 + ")")
  .call(xAxis)
  .append('text')
  .text('Million');

  updata
    .attr("transform", "translate(" + 120 + "," + 0 + ")")
    .transition()
    .duration(2000)
    .attr("x", function(d,i){return i*120})
    .attr("y", function(d,i){return 600-(yscale(col[0])-yscale(d))})
    .attr("width", 90)
    .attr("height", function(d,i){return yscale(col[0])-yscale(d)})
    .attr("fill", function(d,i){
      return i==0?"red":"blue"
    })

  enter.append("rect")
    .attr("transform", "translate(" + 120 + "," + 0 + ")")
    .attr("x", function(d,i){return i*120})
    .attr("y", function(d,i){return 600-(yscale(col[0])-yscale(d))})
    .attr("width", 90)
    .attr("height", function(d,i){return yscale(col[0])-yscale(d)})
    .attr("fill", function(d,i){
      return i==0?"red":"blue"
    })
    .attr("opacity",0)
    .transition()
    .attr("opacity",1)
    .duration(2000)
};

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
      //console.log (name+1);
      s=d.人口数;
    }
  })
  return s;
}

function createDensity(divId, Map, popData00, popData10, areaData) {
  var width = 1000;
  var height = 1000;
  var sign=0;

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

  var color = d3.scale.linear()
    .domain(colExtent)
    .range(["rgb(254,224,210)", "rgb(222,45,38)"])
    .interpolate(d3.interpolateHcl);

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([0, 0])
    .html(function(d) {
      if (sign==0){
        return "State: "+d.properties.name+"  Population: "+getpop(d.properties.name, popData00);
      } else {
        return "State: "+d.properties.name+"  Population: "+getpop(d.properties.name, popData10);
      }
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
        d3.select(this)
          .classed("highlight", true);
      })
    .on('mouseout', function(d,i){
        tip.hide(d,i);
        d3.select(this)
          .classed("highlight", false);
      })
    .on('click', function(d,i){
        var bardata=[Number(getpop(d.properties.name, popData00)),Number(getpop(d.properties.name, popData10))];
        createBarchart(bardata, colExtent);
      });

  var pop00_click = d3.select("#pop00").on('click',function(){
    sign=0;
    MapUpdata("#PopMap", Map, popData00, 0, colExtent);
  });
  var pop10_click = d3.select("#pop10").on('click',function(){
    sign=1;
    MapUpdata("#PopMap", Map, popData10, 1, colExtent);
  });
}

function processData(errors, Map, popData00, popData10, areaData) {
  // console.log(errors);
  createMap("#PopMap", Map, popData00, popData10);
  createDensity("#DenMap", Map, popData00, popData10, areaData);
}
queue()
  .defer(d3.json, "https://raw.githubusercontent.com/leoncaoyc/China_Population/master/china.geojson")
  .defer(d3.json, "https://raw.githubusercontent.com/leoncaoyc/China_Population/master/00pop.json")
  .defer(d3.json, "https://raw.githubusercontent.com/leoncaoyc/China_Population/master/10pop.json")
  .defer(d3.json, "https://raw.githubusercontent.com/leoncaoyc/China_Population/master/area.json")
  .await(processData);
