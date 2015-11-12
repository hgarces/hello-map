var map;

function init(){
    map = new ol.Map({
        target:'map',
        renderer:'canvas',
    	view: new ol.View({
    		projection: 'EPSG:900913',
    		center:[-1017759.03868,4684061.08394],
    		zoom:7
    	})   
    });

    ////////////
    // LAYERS
    ////////////
    var osmLayer = new ol.layer.Tile({
    	source: new ol.source.OSM()
	});
	map.addLayer(osmLayer);
}


