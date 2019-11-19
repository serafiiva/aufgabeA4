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

//Overlay
const popup = new Overlay({
  element: document.getElementById('popup')
});
// eslint-disable-next-line no-undef
popup.setPosition(coordinate);
map.addOverlay(popup);

(function() {
  const thunderforestAttributions = [
    'Tiles &copy; <a href="http://www.thunderforest.com/">Thunderforest</a>',
    OSM.ATTRIBUTION
  ];
  const map = new Map({
    target: 'map',
    layers: [
      new LayerGroup({
        'title': 'Base maps',
        layers: [
          new LayerGroup({
            title: 'Water color with labels',
            type: 'base',
            combine: true,
            visible: false,
            layers: [
              new TileLayer({
                // eslint-disable-next-line no-undef
                source: new Stamen({
                  layer: 'watercolor'
                })
              }),
              new TileLayer({
                title: 'Thunderforest - OpenCycleMap',
                type: 'base',
                visible: false,
                source: new OSM({
                  url: 'http://{a-c}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png',
                  attributions: thunderforestAttributions
                })
              }),
              new TileLayer({
                title: 'Thunderforest - Outdoors',
                type: 'base',
                visible: false,
                source: new OSM({
                  url: 'http://{a-c}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png',
                  attributions: thunderforestAttributions
                })
              }),
              new TileLayer({
                title: 'Thunderforest - Landscape',
                type: 'base',
                visible: false,
                source: new OSM({
                  url: 'http://{a-c}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png',
                  attributions: thunderforestAttributions
                })
              }),
              new TileLayer({
                title: 'Thunderforest - Transport',
                type: 'base',
                visible: false,
                source: new OSM({
                  url: 'http://{a-c}.tile.thunderforest.com/transport/{z}/{x}/{y}.png',
                  attributions: thunderforestAttributions
                })
              }),
              new TileLayer({
                title: 'Thunderforest - Transport Dark',
                type: 'base',
                visible: false,
                source: new OSM({
                  url: 'http://{a-c}.tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png',
                  attributions: thunderforestAttributions
                })
              })
            ]
          }),
          new TileLayer({
            title: 'OSM',
            type: 'base',
            visible: true,
            source: new OSM()
          })
        ]
      }),
      new Overlay ({
        title: 'Overlays',
        fold: 'open',
        layers: [
          new VectorLayer({
            title: 'PeopleLayer',
            source: VectorLayer({
              params: {
                'Layers': 'show:'
              },
              url: 'data/map.geojson'
            })
          })


        ]
      })
    ],
    view: new View({
      center: olProj.fromLonLat([16.372, 48.209]),
      zoom: 14
    })
  });

  const layerSwitcher = new LayerSwitcher({
    tipLabel: 'Legende',
    groupSelectStyle: 'group'
  });
  map.addControl(layerSwitcher);

})();
