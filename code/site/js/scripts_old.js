function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

$(document).ready(function(){/* google maps -----------------------------------------------------*/
google.maps.event.addDomListener(window, 'load', initialize);

function initialize() {

  /* position Amsterdam */
  var latlng = new google.maps.LatLng(41.87, -87.69)
  var mapOptions = {
    center: latlng,
    scrollWheel: false,
    zoom: 11
  };
  
  
  var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  
  
  
  var directionsDisplay = new google.maps.DirectionsRenderer();// also, constructor can get "DirectionsRendererOptions" object
  directionsDisplay.setMap(map); // map should be already initialized.


  // var start = new google.maps.LatLng(41.85, -87.62);
//   var end = new google.maps.LatLng(41.86, -87.65);
// 
//   var request = {
//         origin : start,
//         destination : end,
//         travelMode : google.maps.TravelMode.DRIVING
//     };
//     var directionsService = new google.maps.DirectionsService(); 
//     directionsService.route(request, function(response, status) {
//         if (status == google.maps.DirectionsStatus.OK) {
//             directionsDisplay.setDirections(response);
//             console.log(response)
//         }
//     });
function listenMarker(marker,infowindow){
			google.maps.event.addListener(marker, 'click', function(e) {
			  infowindow.open(map,marker);
		    });
}
function appendicize(data,id_str,id_end){
	if(!$("#"+id_str).length){
      	$("#routelists").append('<div class="panel-heading"><h4><a id="'+id_str+'" href="#">'+data[0]['legs'][0]['start_address']+'</a></h4></div><ul id="'+id_str+'_list" class="list-group" style="display:none"></ul>')
  		$("#"+id_str).click(function(event){
  		  $("#"+event.target.id+"_list").toggle();
  		  for (k in db){
			db[k]['poly'].setMap(null)
		  }
  		  for (k in db){
  		      if(k.split("_")[0]==id_str){
				  data = db[k]['data'];
				  var decodedPath = google.maps.geometry.encoding.decodePath(data[0]['overview_polyline']['points']);
				  var n = data[0]['crimes'].length
				  var R = (255 * n) / 100
				  var B = (255 * (100 - n)) / 100 
				  var G = 0
				  var flightPath = new google.maps.Polyline({
					path: decodedPath,
					geodesic: true,
					strokeColor: "rgb("+[R, G, B].join(",")+")",
					strokeWeight: 2
				  });
				  flightPath.setMap(map);
				  db[k]['poly']=flightPath;
			  }
			}
  		});
      }
      $("#"+id_str+"_list").append('<li id="'+id_str+'_'+id_end+'" class="list-group-item"><a href="#" id="'+id_str+'_'+id_end+'_link'+'">'+data[0]['legs'][0]['end_address']+"</a></li>")
      
}
  $.getJSON( "js/routes.json", function( datas ) {
    db = []
    for (i in datas) {
      var data = datas[i]
//       alert(data[0])
	  var id_str = data[0]['legs'][0]['start_address'].replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s{2,}/g," ").split(" ").join("-")
      var id_end = data[0]['legs'][0]['end_address'].replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s{2,}/g," ").split(" ").join("-")
      appendicize(data,id_str,id_end)
      $("#"+id_str+"_"+id_end+"_link").click(function(event){
      	  data = db[event.target.id]['data'];
      	  var decodedPath = google.maps.geometry.encoding.decodePath(data[0]['overview_polyline']['points']);
		  var n = data[0]['crimes'].length
		  var R = Math.floor((255 * n) / 100)
		  var G = 0
		  var B = Math.floor((255 * (100 - n)) / 100 )
		  var flightPath = new google.maps.Polyline({
			path: decodedPath,
			geodesic: true,
			strokeColor: "rgb("+[R, G, B].join(",")+")",
			strokeWeight: 6
		  });
		  flightPath.setMap(map)
		  if(typeof oldmarkers !== "undefined"){
			  for (j in oldmarkers){
		  		oldmarkers[j].setMap(null);
		  	  }
		  }
		  oldmarkers = []
		  for (j in data[0]['crimes']){
		    var crime = data[0]['crimes'][j]
		    var latlng = new google.maps.LatLng(crime[14], crime[15]); 
			var marker = new google.maps.Marker({
			  position: latlng,
			  url: '/',
			});
			contentString = crime[1]+"<br/>"+crime[4]+"<br/>"+crime[5]
			var infowindow = new google.maps.InfoWindow({content: contentString});

			listenMarker(marker,infowindow)

			marker.setMap(map);
  			oldmarkers.push(marker)
		  }
		  
		  
		  if(typeof oldpoly !== "undefined"){
			  oldpoly.setMap(null);
		  }else{
			  for (k in db){
				db[k]['poly'].setMap(null)
			  }
		  }
		  oldpoly = flightPath
      });
      
      var decodedPath = google.maps.geometry.encoding.decodePath(data[0]['overview_polyline']['points']);
      var n = data[0]['crimes'].length
      var R = (255 * n) / 100
	  var B = (255 * (100 - n)) / 100 
	  var G = 0
      var flightPath = new google.maps.Polyline({
        path: decodedPath,
        geodesic: true,
        strokeColor: "rgb("+[R, G, B].join(",")+")",
        strokeWeight: 2
      });
	  db[id_str+"_"+id_end+"_link"]={'poly':flightPath,'data':data};
      
        flightPath.setMap(map);
      
    }
  });
  $("#showall").click(function(){
  	for (k in db){
		db[k]['poly'].setMap(null)
	  }
	for (k in db){
  	  data = db[k]['data'];
  	  var decodedPath = google.maps.geometry.encoding.decodePath(data[0]['overview_polyline']['points']);
      var n = data[0]['crimes'].length
      var R = (255 * n) / 100
	  var B = (255 * (100 - n)) / 100 
	  var G = 0
      var flightPath = new google.maps.Polyline({
        path: decodedPath,
        geodesic: true,
        strokeColor: "rgb("+[R, G, B].join(",")+")",
        strokeOpacity: 0.2,
        strokeWeight: 2
      });
	  flightPath.setMap(map);
	  db[k]['poly']=flightPath;
  	}
  });
  
};
/* end google maps -----------------------------------------------------*/
});