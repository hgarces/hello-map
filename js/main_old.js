var map;
var drawLayer;
var boundingBox;
var styleCache = {};
var geoLayer = new ol.layer.Vector({
    source : new ol.source.Vector({
		projection : 'EPSG:900913',
		url : './myGeoJson.geojson'
	}),
	style : function(feature, resolution) {
		var text = resolution < 5000 ? feature.get('name') : '';
		if (!styleCache[text]) {
			styleCache[text] = [new ol.style.Style({
				fill : new ol.style.Fill({
					color : 'rgba(255, 255, 255, 0.1)'
				}),
				stroke : new ol.style.Stroke({
					color : '#319FD3',
					width : 1
				}),
				text : new ol.style.Text({
					font : '12px Calibri,sans-serif',
					text : text,
					fill : new ol.style.Fill({
						color : '#000'
					}),
					stroke : new ol.style.Stroke({
						color : '#fff',
						width : 3
					})
				}),
				zIndex : 999
			})];
		}
		return styleCache[text];
	}
});

function init(){
    map = new ol.Map({
        target:'map',
        renderer:'canvas',
    	view: new ol.View({
    		projection: 'EPSG:900913',
    		center:[-8015003.33712,4160979.44405],
    		zoom:5
    	})
    });

    var newLayer = new ol.layer.Tile({
    	source: new ol.source.OSM()
	});

	map.addLayer(newLayer);

	var vectorLayer = new ol.layer.Tile({
		source: new ol.source.TileWMS({
			preload: Infinity,
			url: 'http://felek.cns.umass.edu:8080/geoserver/wms',
			serverType:'geoserver',
			params:{
				'LAYERS':"Streams:Developed", 'TILED':true
			}
		})
	});
	
	map.addLayer(vectorLayer);

	var vectorLayer_2 = new ol.layer.Tile({
		source: new ol.source.TileWMS({
			preload: Infinity,
			url: 'http://felek.cns.umass.edu:8080/geoserver/wms',
			serverType:'geoserver',
			params:{
				'LAYERS':"Streams:Deposition_of_Nitrogen", 'TILED':true
			}
		})
	});
	
	map.addLayer(vectorLayer_2);
	map.addLayer(geoLayer);

	//Zoom
	var myZoom = new ol.control.Zoom();
	map.addControl(myZoom);
	//Zoom is a default control, but there are some parameters you could change if you wanted:
	//Check them out here: http://ol3js.org/en/master/apidoc/ol.control.Zoom.html

	//ZoomSlider
	var myZoomSlider = new ol.control.ZoomSlider();
	map.addControl(myZoomSlider);
	//The zoom slider is a nice addition to your map. It is wise to have it accompany your zoom buttons.

	//Full Screen
	var myFullScreenControl = new ol.control.FullScreen();
	map.addControl(myFullScreenControl);

	//ZoomToExtent
	var myExtentButton = new ol.control.ZoomToExtent({
		extent: geoLayer.getSource().getExtent()
	});
	map.addControl(myExtentButton);

	map.on('singleclick', function(evt){
		if(draw != null) return;
		var coord = evt.coordinate;
		spawnPopup(coord);
	});

	function spawnPopup(coord){
		var viewProjection = map.getView().getProjection();
		var viewResolution = map.getView().getResolution();
		var url = vectorLayer.getSource().getGetFeatureInfoUrl(coord, viewResolution, viewProjection, {
			'INFO_FORMAT' : 'application/json'
		});
		if (url) {
			console.log(url)
		    $.getJSON(url, function(d) {
		        console.log(d);
			})
		} else {
		    console.log("Uh Oh, something went wrong.");
		}
	    var popup = $("<div class='popup'><button class='closebtn' onclick='destroyPopup()'>Close</button></div>");
	    
	    var overlay = new ol.Overlay({
	        element:popup
	    });
	    
	    map.addOverlay(overlay);
	    overlay.setPosition(coord);
	}

	drawLayer = new ol.layer.Vector({
	    source : new ol.source.Vector(),
		style : new ol.style.Style({
			fill : new ol.style.Fill({
				color : 'rgba(255, 255, 255, 0.2)'
			}),
			stroke : new ol.style.Stroke({
				color : '#ffcc33',
				width : 2
			}),
			image : new ol.style.Circle({
				radius : 7,
				fill : new ol.style.Fill({
					color : '#ffcc33'
				})
			})
		})
	});
	map.addLayer(drawLayer);

	boundingBox = new ol.interaction.DragBox({
	    condition: ol.events.condition.always,
	    style: new ol.style.Style({
	        stroke: new ol.style.Stroke({
	            color: [0,0,255,1]
	        })
	    })
	});
	map.addInteraction(boundingBox);

	map.on('boxend', function(e){
  		map.removeInteraction(boundingBox);  
	})
}

function destroyPopup(){
	$(popup).remove();
	popup = null;
}

function removeTopLayer () {
	var layers = map.getLayers();
	layers.pop();
}

function swapTopLayer(){
    var layers = map.getLayers();
	var topLayer = layers.removeAt(2);
	layers.insertAt(1, topLayer);
}

var draw;
function startDraw(type){
    if(draw != null){
		cancelDraw();	
	}

	draw = new ol.interaction.Draw({
		source:drawLayer.getSource(),
		type:type
	});
	map.addInteraction(draw);
	
}

function cancelDraw(){
	if(draw == null)return;
	
	map.removeInteraction(draw);
}

function fitMapToExtent(extent){
    map.getView().fitExtent(extent, map.getSize());
}

