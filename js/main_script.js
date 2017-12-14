var dda_countries = ['Malaysia', 'Hong Kong', 'Singapore', 'Philippines', 'Thailand']

var xaxes = {
	'steatosis' : ['x', 'S0', 'S1', 'S2', 'S3'],
	'activity' : ['x', 'A0', 'A1', 'A2', 'A3', 'A4'],
	'fibrosis' : ['x', 'F0', 'F1', 'F2', 'F3', 'F4']
}

var dict_stages_percent_per_country = {
	"Malaysia": {
		"activity" : [0.696262,0.185358,0.049065,0.031931,0.037383],
		"fibrosis" : [0.522586, 0.253115, 0.077882, 0.084112, 0.062305],
		"steatosis" : [0.331465,0.313245,0.157673,0.197617]

	},
	"Hong Kong": {
		"activity" : [1],
		"fibrosis" : [0.571429, 0.428571],
		"steatosis" : [0.727273,0.181818,0.045455,0.045455]
	},
	"Singapore": {
		"activity" : [0.764398,0.145288,0.031414,0.02356,0.03534],
		"fibrosis" : [0.675393, 0.196335, 0.045812, 0.04712, 0.03534],
		"steatosis" : [0.45512,0.243995,0.141593,0.159292]

	},
	"Philippines": {
		"activity" : [0.636364,0.232586,0.044864,0.044864,0.041322],
		"fibrosis" : [0.687131, 0.174734, 0.047226, 0.05549, 0.035419],
		"steatosis" : [0.25974,0.279811,0.184179,0.276269]

	},
	"Thailand": {
		"activity" : [0.652722, 0.205731, 0.043553, 0.041834, 0.05616],
		"fibrosis" : [0.531232,0.204011,0.068195,0.082521,0.11404],
		"steatosis" : [0.325866,0.252546,0.179226,0.242363]

	}
}

//Country code
var width = 900;
var height = 600;

// Disease by default - fibrosis
var disease_name = 'fibrosis';
// Country by default
var country_name = 'Thailand';

var projection = d3.geoMercator();

var svg = d3.select("body").append("svg")
.attr("width", width)
.attr("height", height);
var path = d3.geoPath()
.projection(projection);
var g = svg.append("g");      

var tooltip = d3.select("body")
.append("div")
.attr("class", "tooltip")
.style("opacity", 0);

d3.json("world_hires.json", function(error, topology) {
	g.selectAll("path")
	.data(topojson.object(topology, topology.objects.countries)
		.geometries)
	.enter()
	.append("path")
	.attr("d", path)
	.attr("fill", function(d, ind){
		country_name = topology.objects.countries.geometries[ind].properties.name
		d.country = country_name;
		if(dda_countries.includes(country_name)){
			return "#cacaca";
		}else{
			return "#e5e5e5";
		}
	})
	.attr("stroke", "white")
	.attr("stroke-width", 0.15)
	.on("mouseover", function(d, ind) {
		tooltip.html(d.country  + "<br/> ")
		.style("left", (d3.event.pageX) + 20 + "px")
		.style("top", (d3.event.pageY) - 20 + "px");
		tooltip.transition()
		.duration(200)
		.style("opacity", .9)
		.transition()
		.duration(2000)
		.style("opacity", 0.);
	})
	.on("click", function(d, ind){
		country_name = d.country
		draw_barplot(country_name, disease_name);
		g.selectAll("path")
		.transition()
		.duration(500)
		.attr("fill", function(d, ind){
			if(dda_countries.includes(d.country)){
				return "#cacaca";
			}else{
				return "#e5e5e5";
			}
		})
		.attr('stroke', 'white')
		.attr('stroke-width', 0.15);

		d3.select(this)
		.transition()
		.duration(50)
		.attr("fill", function(d, ind){
			console.log(d3.select(this).attr("fill"));
			if(d3.select(this).attr("fill")=='orange' || d3.select(this).attr("fill")=='rgb(255, 165, 0)' ){
				console.log(d3.select(this).attr("fill"));
				console.log(d.country)
				if(dda_countries.includes(d.country)){
					return "#cacaca";
				}else{
					return "#e5e5e5";
				}
			}else{
				console.log("not orange :" + d3.select(this).attr("fill"));
				return 'orange';
			}
		})
		.attr("stroke", function(d){
			console.log(d3.select(this).attr("fill"));
			if(d3.select(this).attr("fill")=='orange' || d3.select(this).attr("fill")=='rgb(255, 165, 0)' ){
				console.log(d3.select(this).attr("stroke"));
				return 'white';
			}else{
				console.log("not orange :" + d3.select(this).attr("stroke"));
				return 'orange';
			}
		})
		.attr("stroke-width", function(d){
			console.log(d3.select(this).attr("fill"));
			if(d3.select(this).attr("fill")=='orange' || d3.select(this).attr("fill")=='rgb(255, 165, 0)' ){
				console.log(d3.select(this).attr("stroke-width"));
				return 0.15;
			}else{
				console.log("not orange :" + d3.select(this).attr("stroke-width"));
				return 0.4;
			}
		})
	});
});

 // zoom and pan
 var zoom = d3.zoom()
 .scaleExtent([1, 1.6])
 .translateExtent([[-50, -100], [width + 90, height + 100]])
 .on("zoom",function() {
 	g.attr("transform", "scale(" + 6 + ")translate(" + -690 + "," + -175 + ")" + d3.event.transform);
	g.selectAll("path")  
	.attr("d", path.projection(projection)); 
})
 svg.call(zoom)
 .on("dblclick.zoom", null);


 function draw_barplot(country_name, disease_name){
 	g_plot = svg.append('g')
 	.attr('id', 'chart')
 	.attr('class', 'down');
 	var ar = dict_stages_percent_per_country;
 	var arr = ar[country_name];
 	var xaxis = xaxes[disease_name];
 	console.log(arr);
 	var arrr = Object.assign([], arr[disease_name]);
 	console.log(arrr);
 	arrr.unshift(disease_name);
 	var chart = bb.generate({
 		bindto: "#chart",
 		title: {
 			text: disease_name.charAt(0).toUpperCase() + disease_name.substr(1) + " grades in "+ country_name
 		},
 		data: {
 			"x" : "x",
 			type: "bar",
 			columns: [
 			xaxis,
 			arrr
 			],
 			"labels": {
 				"format": {
 					"steatosis": function (x) {
 						return d3.format("." + "2" + "%")(x)
 					},
 					"activity": function (x) {
 						return d3.format("." + "2" + "%")(x)
 					},
 					"fibrosis": function (x) {
 						return d3.format("." + "2" + "%")(x)
 					}
 				}
 			},
 			"axes": {
 				"steatosis": "y",
 				"activity": "y",
 				"fibrosis": "y"
 			}
 		},
 		"axis": {
 			"y": {
 				"label": "Proportion of the cohort",
 				"max": 1.0,
 				"min": 0,
 				"padding": {
 					"top": 0,
 					"bottom": 0
 				}
 			},
 			"x": {
 				"type": "category"
 			}
 		},
 		"size": {
 			"height": 200,
 			"width": 400
 		},
 		"bar": {
 			"width": {
 				"ratio": 0.5
 			}
 		},
 		"zoom": {
 			"enabled": false
 		}
 	});
 	g_plot.selectAll('svg')
 	.attr('class', 'bb_chart')
 	.transition()
 	.duration(0)
 	.style('top', 120)
 	.style('left', 0);
 }

// Dropdown button 
var svg_dropbtn = d3.select('body').append('div')
.attr('class', 'svg_dropbtn');
svg_dropbtn.html("<div class='dropdown'> <button onclick='dropdownCallback()'' class='dropbtn'>Disease</button> <div id='dropdown-instance' class='dropdown-disease'> <a href='#' id='steatosis' class='disease_notselected'>Steatosis</a> <a href='#' id='activity' class='disease_notselected'>Activity</a> <a href='#' id='fibrosis' class='disease_notselected'>Fibrosis</a></div></div>");
svg_dropbtn.style("left", 850 + "px")
.style("top", 270 + "px");

d3.selectAll('.disease_notselected')
.on('click', function(){
	d3.selectAll('disease_selected').attr('class', 'disease_notselected');
	d3.select(this).attr('class', 'disease_selected');
	disease_name = d3.select(this).attr('id');
	draw_barplot(country_name, disease_name);
})

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function dropdownCallback() {
	document.getElementById("dropdown-instance").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
	if (!event.target.matches('.dropbtn')) {

		var dropdowns = document.getElementsByClassName("dropdown-disease");
		var i;
		for (i = 0; i < dropdowns.length; i++) {
			var openDropdown = dropdowns[i];
			if (openDropdown.classList.contains('show')) {
				openDropdown.classList.remove('show');
			}
		}
	}
}

// Initiate zoom in
 g.transition()
 .duration(4000)
 .attr("transform", "scale(" + 6 + ")translate(" + -690 + "," + -175 + ")");