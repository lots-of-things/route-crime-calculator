function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

$.ajaxSetup({beforeSend: function(xhr){
    if (xhr.overrideMimeType)
    {
        xhr.overrideMimeType("application/json");
    }
}
});

binh = 3;
flights = {};
boxes = {};
index = 0
curdat = new Date()
dy=0
mn=0
hr=0
loadedDB=""
changeMonth(curdat.getMonth()+1)
changeDay(curdat.getDay())
changeHour(curdat.getHours())

loadDB()
    function changeHour(v){
        hr_lab=['12AM','1AM','2AM','3AM','4AM','5AM','6AM','7AM','8AM','9AM','10AM','11AM','12PM','1PM','2PM','3PM','4PM','5PM','6PM','7PM','8PM','9PM','10PM','11PM']
        $("#chhour").text(hr_lab[v])
        hr = Math.floor(v/binh)*binh
        setT();
    }
    function changeDay(v){
        dy_lab=['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
        $("#chday").text(dy_lab[v])
        dy = v
        setT();
    }
    function changeMonth(v){
        mn_lab=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        $("#chmonth").text(mn_lab[v])
        hr = mn=v+1
        setT();
    }
    function setT(){
        var str = "" + mn
        var pad = "00"
        var ans = pad.substring(0, pad.length - str.length) + str
        db_file = 'js/output/dataM'+ ans
        var str = "" + dy
        var pad = "00"
        var ans = pad.substring(0, pad.length - str.length) + str
        db_file = db_file+'D'+ans
        var str = "" + hr
        var pad = "00"
        var ans = pad.substring(0, pad.length - str.length) + str
        db_file = db_file+'H'+ans+'.json'
    }
    
    function loadDB(){
        if(loadedDB!=db_file){
                ready=false;
                $.getJSON(db_file, function(json) {
                    db = json;
                    dlat=db['dlat'];
                    dlon=db['dlon'];
                    latS=db['latS'];
                    lonW=db['lonW'];
                    ready=true;
                });
        }
        loadedDB = db_file
    }
    
    function killFlights(){
    for (i in flights){
                for (ii in flights[i]){
                        flights[i][ii].setMap(null)
                }
        }
    flights = []
    }

    function disapear(){
        
    
    }

function imageOverlay(imurl){
    var imageBounds = new google.maps.LatLngBounds(new google.maps.LatLng(42.022295, -87.899201), new google.maps.LatLng(41.645307, -87.525472));
    var overlayOpts = {opacity:1}
    overlay = new google.maps.GroundOverlay(imurl,imageBounds,overlayOpts);
    overlay.setMap(map);
}

function closeOverlay(){
        $("#showpred").removeClass("btn-primary")
    $("#showdata").removeClass("btn-primary")
    $("#showpeeps").removeClass("btn-primary")
    overlay.setMap(null);
}

function introOverlay(){
    imageOverlay('http://lots-of-things.github.io/route-crime-calculator/site/im/data.png')
}

function showPred(){
closeOverlay()
    imageOverlay('http://transitized.com/wp-content/uploads/2014/12/Capture-d%E2%80%99%C3%A9cran-2014-12-15-%C3%A0-15.31.43.png')
    $("#showpred").addClass("btn-primary")
}

function showPeeps(){
closeOverlay()
    imageOverlay('http://transitized.com/wp-content/uploads/2014/12/Capture-d%E2%80%99%C3%A9cran-2014-12-15-%C3%A0-15.31.43.png')
    $("#showpeeps").addClass("btn-primary")
}

function showData(){
closeOverlay()
    imageOverlay('http://transitized.com/wp-content/uploads/2014/12/Capture-d%E2%80%99%C3%A9cran-2014-12-15-%C3%A0-15.31.43.png')
    $("#showdata").addClass("btn-primary")
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
    introOverlay()
    //showData();
}



function crimepred(){
    if(!ready){
        setTimeout(crimepred,1000);
    }else{
            maxxie = 0
                    
                for (i in dat['legs'][0]['steps']){
                    s = dat['legs'][0]['steps'][i];
                    if(s['travel_mode']=='WALKING'){
                        for (ii in s['steps']){
                            ss = s['steps'][ii];
                            x1 = ss['start_location'].lng()
                            y1 = ss['start_location'].lat()
                            x2 = ss['end_location'].lng()
                            y2 = ss['end_location'].lat()
                            
                                xl = (x1-lonW)/dlon
                                yl = (y1-latS)/dlat
                                xr = (x2-lonW)/dlon
                                yr = (y2-latS)/dlat
                                if(x1>x2){
                                    xl = (x2-lonW)/dlon
                                    yl = (y2-latS)/dlat
                                    xr = (x1-lonW)/dlon
                                    yr = (y1-latS)/dlat
                                }
                                xg = Math.floor(xl)
                                xs = Math.ceil(xr)
                                for (x = xg; x < xs; x++){
                                    y = Math.round((yr-yl)/(xr-xl)*(x-xl)+yl)
                                        if(x in db){
                                            if(y in db[x]){
                                                    if(db[x][y]['max']>maxxie){
                                                        maxxie = db[x][y]['max'];
                                                    }
                                            }
                                        }
                                }
                        }
                    }
                }
            n = maxxie;
    }
}

chiBounds = new google.maps.LatLngBounds(new google.maps.LatLng(41.5,-88), new google.maps.LatLng(42,-87.5))
function addRouteBox(){
        toadd = '<div class="panel panel-default"><button type="button" class="close" onclick=removeRoute('+index+')><span aria-hidden="true">&times;</span></button><div class="panel-heading"><div class="input-group">'
        toadd=toadd+''
        toadd=toadd+'<input type="text" placeholder="'+start+'" readonly>'
        toadd=toadd+'<input type="text" placeholder="'+end+'" readonly>'
        toadd=toadd+'<span  class="label label-default pull-right" >'+$("#chmonth").text()+'</span>'
        toadd=toadd+'<span  class="label label-default pull-right" >'+$("#chday").text()+'</span>'
        toadd=toadd+'<span  class="label label-default pull-right" >'+$("#chhour").text()+'</span>'
        toadd=toadd+'</div></div><div id="routeinfo" class="panel-body">'
        
        
        toadd=toadd+'</div></div>'
        
        boxes[index] = $(toadd).appendTo('#left')
}

function removeRoute(ind){
        boxes[ind].remove()
        for (ii in flights[ind]){
                flights[ind][ii].setMap(null)
        }
}


function calcRoute_nav(){
        var start = $('#from_nav').val();
        if(start.indexOf("hicago") < 0){
            start = start + ", Chicago, IL"
        }
        var end = $('#to_nav').val();
        if(end.indexOf("hicago") < 0){
            end = end + ", Chicago, IL"
        }
        route();
}
function calcRoute(){
        start = $('#from').val();
        if(start.indexOf("hicago") < 0){
            start = start + ", Chicago, IL"
        }
        end = $('#to').val();
        if(end.indexOf("hicago") < 0){
            end = end + ", Chicago, IL"
        }
        route();
}

    function route() {
        var request = {
            origin:start,
            destination:end,
            travelMode: google.maps.TravelMode.TRANSIT,
            provideRouteAlternatives:true
        };
        directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                    $("#errormess").css("display", "none");
                    data = response.routes;
                        addRouteBox();
                        flights[index]=[]
                        for (i in data){
                            console.log(data[i])
                            var decodedPath = google.maps.geometry.encoding.decodePath(data[i]['overview_polyline']);
                            if(chiBounds.contains(response.routes[0].bounds.getNorthEast()) && chiBounds.contains(response.routes[0].bounds.getSouthWest())){
                                    dat = data[i]
                                    crimepred()
                                    console.log('n = '+n)
                                    var R = Math.floor(255 * n) 
                                    var B = Math.floor(255 * (1 - n))
                                    var G = 0
                                    console.log(decodedPath)
                                    var flightPath = new google.maps.Polyline({
                                        path: decodedPath,
                                        geodesic: true,
                                        strokeColor: "rgb("+[R, G, B].join(",")+")",
                                        strokeWeight: 6,
                                        zIndex: 2
                                    });
                                    flightPath.setMap(map);
                                    flights[index].push(flightPath);
                            
                            }else{
                                $("#errormess").css("display", "block");
                            }
                            var flightPath2 = new google.maps.Polyline({
                                path: decodedPath,
                                geodesic: true,
                                strokeColor: '#FFFFFF',
                                strokeWeight: 10,
                                zIndex: 1
                            });
                            flightPath2.setMap(map);
                            flights[index].push(flightPath2);
                        }
                        index++
            }else{
                $("#errormess").css("display", "block");
            }
        });

    }

google.maps.event.addDomListener(window, 'load', initialize);

