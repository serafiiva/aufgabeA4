import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import Vector from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import Style from 'ol/style/Style';
import Text from 'ol/style/Text';
import Stroke from 'ol/style/Stroke';
import * as olProj from 'ol/proj';
import OSM from 'ol/source/OSM';
import Circle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import {Group as LayerGroup} from 'ol/layer';
import Overlay from 'ol/Overlay';
import LayerSwitcher from 'ol-layerswitcher/src/ol-layerswitcher';

const map = new Map({
  target: 'map',
  view: new View({
    center: olProj.fromLonLat([16.372, 48.209]),
    zoom: 14
  })
});

map.addLayer(new TileLayer({
  source: new OSM()
}));


const peopleLayer = new VectorLayer({
  source: new Vector({
    url: 'data/map.geojson',
    format: new GeoJSON()
  })
});
peopleLayer.setStyle(function(feature) {
  return new Style({
    text: new Text({
      text: feature.get('name'),
      font: 'Bold 8pt Verdana',
      stroke: new Stroke({
        color: 'white',
        width: 3
      })
    })
  });
});

map.addLayer(peopleLayer);


const searchResultSource = new Vector();
const searchResultLayer = new VectorLayer({
  source: searchResultSource
});

searchResultLayer.setStyle(new Style({
  image: new Circle({
    fill: new Fill({
      color: 'rgba(255,255,255,0.4)'
    }),
    stroke: new Stroke({
      color: '#3399CC',
      width: 1.25
    }),
    radius: 15
  })
}));
map.addLayer(searchResultLayer);

// Koordinatensuche
const xhr = new XMLHttpRequest;
xhr.open('GET', 'https://photon.komoot.de/api/?q=' + 'Wien Schwedenplatz');
xhr.onload = function() {
  const json = JSON.parse(xhr.responseText);
  const geoJsonReader = new GeoJSON({
    featureProjection: 'EPSG:3857'
  });
  const features = geoJsonReader.readFeatures(json);
  // eslint-disable-next-line no-console
  console.log(features);
  searchResultSource.addFeatures(features);
};
xhr.send();
