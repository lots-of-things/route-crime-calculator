function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
crimedb = [];
$.getJSON( "js/crimes.json", function( pred ) {
  crimedb = pred;
});
  
binl = 0.005;
binh = 4;
binm = 3;
storect = [];
flightdb = [];
prediction = [];
people = [];
curdat = new Date()
glob_hr = curdat.getHours();
glob_mn = curdat.getMonth();

function changeMonth(val){
glob_mn = val*binm
disapear()
console.log($("#chmonth"))
$("#chmonth").text($("#monthlist").find("li")[val].textContent)
}

function changeHour(val){
glob_hr = val*binh
disapear()
console.log($("#chhour"))
$("#chhour").text($("#hourlist").find("li")[val].textContent)
}

$.getJSON( "js/pass.json", function( pre ) {
  people = pre;
});

function disapear(){
	for (i in flightdb){
		flightdb[i].setMap(null)
	}
	for (i in storect){
		storect[i].setMap(null)
	}
	storect=[]
	flightdb = []
    $("#showpred").removeClass("btn-primary")
    $("#showpred2").removeClass("btn-primary")
    $("#showtpred").removeClass("btn-primary")
    $("#showdata").removeClass("btn-primary")
    $("#showtdata").removeClass("btn-primary")
    $("#showpeeps").removeClass("btn-primary")
    $("#showall").removeClass("btn-primary")
}

function showPred(){
	disapear();
	$.getJSON( "js/pred.json", function( pred ) {
	  prediction = pred;
	  for (xx in pred){
		for(yy in pred[xx]){
		  x = xx*binl
		  y = yy*binl
		  var n = pred[xx][yy][-1]
		  var R = Math.floor((255 * n) )
		  var G = 0
		  var B = Math.floor((255 * (1 - n)) )
		  var rectangle = new google.maps.Rectangle({
			strokeOpacity: 0,
			fillColor: "rgb("+[R, G, B].join(",")+")",
			fillOpacity: n,
			map: map,
			bounds: new google.maps.LatLngBounds(
			  new google.maps.LatLng(y, -x),
			  new google.maps.LatLng(y+binl, -x+binl))
		  });
		  storect.push(rectangle);
		}
	  }
	});
	$("#showpred").addClass("btn-primary")
    
}

function showPred2(){
	disapear();
	$.getJSON( "js/pred2.json", function( pred ) {
	  prediction = pred;
	  for (xx in pred){
		for(yy in pred[xx]){
		  x = xx*binl
		  y = yy*binl
		  var n = pred[xx][yy][-1]*5
		  var R = Math.floor((255 * n) )
		  var G = 0
		  var B = Math.floor((255 * (1 - n)) )
		  var nn = Math.min(n,1)
  		  var rectangle = new google.maps.Rectangle({
			strokeOpacity: 0,
			fillColor: "rgb("+[R, G, B].join(",")+")",
			fillOpacity: nn,
			map: map,
			bounds: new google.maps.LatLngBounds(
			  new google.maps.LatLng(y, -x),
			  new google.maps.LatLng(y+binl, -x+binl))
		  });
		  storect.push(rectangle);
		}
	  }
	});
	$("#showpred2").addClass("btn-primary")
    
}

function showTimelyPred(){
	disapear();
	$.getJSON( "js/pred.json", function( pred ) {
	  for (xx in pred){
		for(yy in pred[xx]){
		  x = xx*binl
		  y = yy*binl
		  hr=Math.floor(glob_hr/binh)
		  mn=Math.floor(glob_mn/binm)
		  var n = pred[xx][yy][mn][hr]
		  var R = Math.floor((255 * n) )
		  var G = 0
		  var B = Math.floor((255 * (1 - n)) )
		  var rectangle = new google.maps.Rectangle({
			strokeOpacity: 0,
			fillColor: "rgb("+[R, G, B].join(",")+")",
			fillOpacity: n,
			map: map,
			bounds: new google.maps.LatLngBounds(
			  new google.maps.LatLng(y, -x),
			  new google.maps.LatLng(y+binl, -x+binl))
		  });
		  storect.push(rectangle);
		}
	  }
	});
	
	$("#showtpred").addClass("btn-primary")
}

function createRect( x,  y, n,tlist,llist){
  var nn = Math.min(n,1)
  var R = Math.floor((255 * n) )
  var G = 0
  var B = Math.floor((255 * (1 - n)) )
  var rectangle = new google.maps.Rectangle({
	strokeOpacity: 0,
	fillColor: "rgb("+[R, G, B].join(",")+")",
	fillOpacity: nn,
	map: map,
	bounds: new google.maps.LatLngBounds(
	  new google.maps.LatLng(y, -x),
	  new google.maps.LatLng(y+binl, -x+binl))
  });
  var contentString = "<b>Crime Types:</b> <br>";
  for (i in tlist){
	contentString = contentString + tlist[i]+", "+llist[i]+"<br>";
  }
  rectangle.cs = contentString;
  rectangle.mymap = map;
  storect.push(rectangle);
  google.maps.event.addListener(rectangle, 'click', function(e){
  	  var ne = rectangle.getBounds().getNorthEast();
	  var infoWindow = new google.maps.InfoWindow();
	  infoWindow.setContent(contentString);
	  infoWindow.setPosition(ne);

	  infoWindow.open(map);
  }); 
}

function showData(){
	  disapear();
	  $.getJSON( "js/data.json", function( pred ) {
	  for (xx in pred){
		for(yy in pred[xx]){
		  x = xx*binl
		  y = yy*binl
		  var n = pred[xx][yy][-1]*5
		  var tlist = pred[xx][yy]['type']
		  var llist = pred[xx][yy]['location']
		  
		  createRect(x,y,n,tlist,llist);
		   
		}
	  }
	});
	
	$("#showdata").addClass("btn-primary")
}

function showTimelyData(){
	  disapear();
	  $.getJSON( "js/data.json", function( pred ) {
	  for (xx in pred){
		for(yy in pred[xx]){
		  hr=Math.floor(glob_hr/binh)
		  mn=Math.floor(glob_mn/binm)
		  var n = pred[xx][yy][mn][hr]
		  var tlist = pred[xx][yy]['type']
		  var llist = pred[xx][yy]['location']
		  
		  createRect(x,y,n,tlist,llist);
		   
		}
	  }
	});
	
	$("#showtdata").addClass("btn-primary")
}

function showPeeps(){
  disapear();
  for (xx in people){
	for(yy in people[xx]){
	  x = xx*binl
	  y = yy*binl
	  var n = people[xx][yy]
	  console.log(n)
	  var R = Math.floor((255 * n) )
	  var G = 0
	  var B = Math.floor((255 * (1 - n)) )
	  var nn = Math.min(n,1)
	  var rectangle = new google.maps.Rectangle({
		strokeOpacity: 0,
		fillColor: "rgb("+[R, G, B].join(",")+")",
		fillOpacity: nn,
		map: map,
		bounds: new google.maps.LatLngBounds(
		  new google.maps.LatLng(y, -x),
		  new google.maps.LatLng(y+binl, -x+binl))
	  });
	  storect.push(rectangle);
	}
  }
	$("#showpeeps").addClass("btn-primary")
}

function showall(){
  $.getJSON( "js/routes.json", function( datas ) {
    disapear();
    for (i in datas) {
      var data = datas[i]
      var decodedPath = google.maps.geometry.encoding.decodePath(data[0]['overview_polyline']['points']);
      var n = data[0]['crimes'].length
      var R = (255 * n) / 100
	  var B = (255 * (100 - n)) / 100 
	  var G = 0
      var flightPath = new google.maps.Polyline({
        path: decodedPath,
        geodesic: true,
        strokeColor: "rgb("+[R, G, B].join(",")+")",
        strokeWeight: 2,
        strokeOpacity: n/100
      });
	  flightdb.push(flightPath);
      
        flightPath.setMap(map);
      
    }
  });
  
	$("#showall").addClass("btn-primary")
}
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

function initialize() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  var chicago = new google.maps.LatLng(41.87, -87.69);
  var mapOptions = {
    center: chicago,
    scrollWheel: false,
    zoom: 11
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  directionsDisplay.setMap(map);
  showPred();
}

function findCrimes(dat){
	retcrime = []
	for (i in dat[0]['legs'][0]['steps']){
		s = dat[0]['legs'][0]['steps'][i];
		if(s['travel_mode']=='WALKING'){
			for (ii in s['steps']){
			    ss = s['steps'][ii]
			    x1 = ss['start_location'].lng()
				y1 = ss['start_location'].lat()
				x2 = ss['end_location'].lng()
				y2 = ss['end_location'].lat()
				xl = x1/binl
				yl = y1/binl
				xr = x2/binl
				yr = y2/binl
				if(x1>x2){
					xl = x2/binl
					yl = y2/binl
					xr = x1/binl
					yr = y1/binl
				}
				xg = Math.floor(xl)
				xs = Math.ceil(xr)
				for (x = xg; x < xs; x++){
					y = Math.round((yr-yl)/(xr-xl)*(x-xl)+yl)
					console.log(crimedb)
					for (i in crimedb[x][y]){
						retcrime.push(crimedb[x][y][i])
					}
				}
			}
		}
	}
	return retcrime;
}

function crimepred(dat){
	summer = [];
	maxxie = 0
	hr=Math.floor(glob_hr/binh)
    mn=Math.floor(glob_mn/binm)
    for (i in dat[0]['legs'][0]['steps']){
		s = dat[0]['legs'][0]['steps'][i];
		if(s['travel_mode']=='WALKING'){
			for (ii in s['steps']){
			    ss = s['steps'][ii];
			    x1 = ss['start_location'].lng()
				y1 = ss['start_location'].lat()
				x2 = ss['end_location'].lng()
				y2 = ss['end_location'].lat()
				xl = x1/binl
				yl = y1/binl
				xr = x2/binl
				yr = y2/binl
				if(x1>x2){
					xl = x2/binl
					yl = y2/binl
					xr = x1/binl
					yr = y1/binl
				}
				xg = Math.floor(xl)
				xs = Math.ceil(xr)
				for (x = xg; x < xs; x++){
					y = Math.round((yr-yl)/(xr-xl)*(x-xl)+yl)
					if(-x in prediction){
						if(y in prediction[-x]){
							summer.push(prediction[-x][y][mn][hr])
							if(prediction[-x][y][mn][hr]>maxxie){
								maxxie = prediction[-x][y][mn][hr];
							}
						}
					}
				}
			}
		}
	}
	return maxxie;
}

function calcRoute() {
  var start = document.getElementById('from').value;
  var end = document.getElementById('to').value;
  var request = {
      origin:start,
      destination:end,
      travelMode: google.maps.TravelMode.TRANSIT
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      data = response.routes;
      var decodedPath = google.maps.geometry.encoding.decodePath(data[0]['overview_polyline']);
      
      n=crimepred(data)
      var R = Math.floor(255 * n) 
	  var B = Math.floor(255 * (1 - n))
	  var G = 0
	  var flightPath = new google.maps.Polyline({
        path: decodedPath,
        geodesic: true,
        strokeColor: "rgb("+[R, G, B].join(",")+")",
        strokeWeight: 6,
        zIndex: 2
      });
      var flightPath2 = new google.maps.Polyline({
        path: decodedPath,
        geodesic: true,
        strokeColor: '#FFFFFF',
        strokeWeight: 10,
        zIndex: 1
      });
	  if(typeof oldpoly !== "undefined"){
		  oldpoly.setMap(null);
		  oldpoly2.setMap(null);
	  }
	  oldpoly = flightPath
	  oldpoly2 = flightPath2
	  flightPath2.setMap(map);
	  flightPath.setMap(map);
      
	  
    }else{
    	alert("Google Maps Directions Query wasn't successful, please try again")
    }
  });
}

google.maps.event.addDomListener(window, 'load', initialize);
