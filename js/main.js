var initialScreen = document.querySelector('.initial-screen');
var statsScreen = document.querySelector('.stats-screen');

var knowMoreButton = document.querySelector('.know-more');
var chartContainer = document.querySelector('.chart');

var firstCicleButton = document.querySelector('.first-cicle');
var secondCicleButton = document.querySelector('.second-cicle');

var pie, path, arc, svg;

/*jshint multistr: true */
var tsvData = "apples	oranges	pears\n\
53245	200	200\n\
23245	100	50\n\
42245	600	1100";

var data = d3.tsv.parse(tsvData);

function change(value) {
  pie.value(function(d) { return d[value]; }); // change the value function
  path = path.data(pie); // compute the new angles
  path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
}

function type(d) {
  d.apples = +d.apples;
  d.oranges = +d.oranges;
  return d;
}

// Store the displayed angles in _current.
// Then, interpolate from _current to the new angles.
// During the transition, _current is updated in-place by d3.interpolate.
function arcTween(a) {
  var i = d3.interpolate(this._current, a);
  this._current = i(0);
  return function(t) {
    return arc(i(t));
  };
}

// D3 chart taken from http://jsbin.com/hegob/1/edit
function paintChart() {
  var width = chartContainer.clientWidth,
      height = chartContainer.clientHeight,
      radius = Math.min(width, height) / 2;

  var color = d3.scale.ordinal()
    .range(colorbrewer.RdBu[9]);

  pie = d3.layout.pie()
      .value(function(d) { return d.apples; })
      .sort(null);

  arc = d3.svg.arc()
      .innerRadius(radius - 100)
      .outerRadius(radius - 20);

  // Responsive behaviour taken from http://jsfiddle.net/BTfmH/12/
  svg = d3.select(".chart").append("svg")
      .attr("width", '100%')
      .attr("height", '100%')
      .attr('viewBox','0 0 ' + Math.min(width, height) + ' ' + Math.min(width, height))
      .attr('preserveAspectRatio', 'xMinYMin')
    .append("g")
      .attr("transform", "translate(" + Math.min(width, height) / 2 + "," + Math.min(width, height) / 2 + ")");

  path = svg.datum(data).selectAll("path")
  .data(pie)
  .enter().append("path")
  .attr("fill", function(d, i) { return color(i); })
  .attr("d", arc)
  .each(function(d) { this._current = d; }); // store the initial angles

  // show the chart
  chartContainer.className = 'chart visible';

  // Add button events
  firstCicleButton.addEventListener('click', function(e) {
    e.preventDefault();
    change('oranges');
  });
  secondCicleButton.addEventListener('click', function(e) {
    e.preventDefault();
    change('pears');
  });

  // prevent further repaints
  statsScreen.removeEventListener('transitionEnd', paintChart);
  statsScreen.removeEventListener('webkitTransitionEnd', paintChart);
  statsScreen.removeEventListener('oTransitionEnd', paintChart);
  statsScreen.removeEventListener('MSTransitionEnd', paintChart);
}

document.onreadystatechange = function() {
	if(document.readyState == 'complete') {
		setTimeout(function(){
			initialScreen.className = 'initial-screen visible';
		}, 1000);
	}
}

knowMoreButton.addEventListener('click', function(event) {
  event.preventDefault();

  initialScreen.className = 'initial-screen';

  setTimeout(function(){
    statsScreen.className = 'stats-screen visible';

    statsScreen.addEventListener('transitionEnd', paintChart);
    statsScreen.addEventListener('webkitTransitionEnd', paintChart);
    statsScreen.addEventListener('oTransitionEnd', paintChart);
    statsScreen.addEventListener('MSTransitionEnd', paintChart);
  }, 700);
});
