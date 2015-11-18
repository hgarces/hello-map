var map;
var center = ol.proj.transform([-7.850000, 39.650761], 'EPSG:4326', 'EPSG:3857');
var styles = [
  'Road',
  'Aerial',
  'AerialWithLabels',
];
var controls = [
	new ol.control.ScaleLine(),
	new ol.control.MousePosition ({
			coordinateFormat: ol.coordinate.createStringXY(6),
			projection: 'EPSG:4326',
			className: 'custom-mouse-position',
	  		target: document.getElementById('mouse-position'),
	  		undefinedHTML: '&nbsp;'
	})

];

function init(){

    /////////////////////
    // LAYERS
    /////////////////////
    var osmLayer = new ol.layer.Tile({
    	source: new ol.source.MapQuest({layer: 'osm'})
	});
	//map.addLayer(osmLayer);

	var bingMapsLayers = [];
	var i, ii;
	for (i = 0, ii = styles.length; i < ii; ++i) {
 		bingMapsLayers.push(new ol.layer.Tile({
	    	visible: false,
	    	preload: Infinity,
	    	source: new ol.source.BingMaps({
	    		key: 'Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3',
	     		imagerySet: styles[i],
	      		maxZoom: 19
	    	})
  		}));
	}

	/////////////////////
	// MAP/VIEW
	/////////////////////
	map = new ol.Map({
        target:'map',
        renderer:'canvas',
        layers: bingMapsLayers,
        controls: controls,
    	view: new ol.View({
    		projection: 'EPSG:900913',
    		center: center,
    		zoom:7
    	})
    });

	/////////////////////
	// MOUSE EVENTS
	/////////////////////
	map.on('click', function(event) {
		var coord = event.coordinate;
		var degrees = ol.proj.transform(coord, 'EPSG:3857', 'EPSG:4326');
		var hdms = ol.coordinate.toStringHDMS(degrees);
		var element = overlay.getElement();

	});

	var select = document.getElementById('layer-select');
	function onChange() {
		var style = select.value;
  		for (var i = 0, ii = bingMapsLayers.length; i < ii; ++i) {
    		bingMapsLayers[i].setVisible(styles[i] === style);
  		}
	}
	select.addEventListener('change', onChange);
	onChange();
	
}



