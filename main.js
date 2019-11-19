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
import Geocoder from 'ol-geocoder/dist/ol-geocoder';
import LayerSwitcher from 'ol-layerswitcher/src/ol-layerswitcher';
import Overlay from 'ol/Overlay';
import {Group as LayerGroup} from 'ol/layer';
import Stamen from 'ol/source/Stamen';


//LAYERSWITCHER FUNKTION
(function() {
  const map = new Map({
    target: 'map',
    layers: [
      new LayerGroup({
        'title': 'Base map',
        layers: [
        ]
      }),
      new TileLayer({
        title: 'Watercolor',
        type: 'base',
        visible: false,
        source: new Stamen({
          layer: 'watercolor'
        })
      }),
      new TileLayer({
        title: 'Terrain',
        type: 'base',
        visible: false,
        source: new Stamen({
          layer: 'terrain'
        })
      }),
      new TileLayer({
        title: 'OSM',
        type: 'base',
        visible: true,
        source: new OSM()
      })
    ],
    view: new View({
      center: olProj.fromLonLat([16.372, 48.209]),
      zoom: 14
    })
  });

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

  //GEOCODER
  const geocoder = new Geocoder('nominatim', {
    provider: 'photon',
    lang: 'de-AT',
    placeholder: 'Search for ...',
    targetType: 'text-input',
    limit: 5,
    keepOpen: false
  });

  geocoder.on('addresschosen', function(evt) {
    const feature = evt.feature,
        coord = evt.coordinate,
        address = evt.address;
    geocoder.getSource().clear(),
    geocoder.getSource().addFeature(feature),
    content.innerHTML = '<p>' + address.formatted + '</p>', Overlay.setPosition(coord);
  /*global content*/
  /*eslint no-undef: "error"*/
  });

  const popup = new Overlay({
    element: document.getElementById('popup')
  });
  popup.setPosition();
  map.addOverlay(popup);

  geocoder.on('addresschosen', function(evt) {
    window.setTimeout(function() {
      popup.show(evt.coordinate, evt.address.formatted);
    }, 3000);
  });

  map.addControl(geocoder);
  //LAYERSWITCHER
  const layerSwitcher = new LayerSwitcher({
    tipLabel: 'Legende',
    groupSelectStyle: 'children'
  });
  map.addControl(layerSwitcher);

  //SIDEAR
  // const sidebar = new Sidebar({element: 'sidebar', position: 'left'});
  // const toc = document.getElementById('layers');
  // LayerSwitcher.renderPanel(map, toc);
  // map.addControl(sidebar);

  //SELECTGROUP
  function createOption(name) {
    const option = document.createElement('option');
    option.value = name;
    option.text = name;
    return option;
  }

  const container = document.createElement('div');
  container.id = 'group-select-style';

  const label = document.createElement('label');
  label.innerText = 'groupSelectStyle: ';
  label.htmlFor = 'group-select-style-input';

  const select = document.createElement('select');
  select.id = 'group-select-style-input';
  select.add(createOption('children'));
  select.add(createOption('group'));
  select.add(createOption('none'));

  select.onchange = function(e) {
    map.removeControl(layerSwitcher);
    LayerSwitcher = new LayerSwitcher({
      groupSelectStyle: select.value
    });
    map.addControl(layerSwitcher);
  };

  container.appendChild(label);
  container.appendChild(select);

  document.body.appendChild(container);
})();

