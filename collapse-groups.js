function () {
    var map = new ol.Map({
            target: 'map',
            layers: [
                new ol.layer.Group({
                    'title': 'Base maps',
                    'fold': 'open',
                    layers: [
                        new ol.layer.Group({
                            title: 'Water color with labels',
                            type: 'base',
                            combine: true,
                            visible: false,
                            layers: [
                                new ol.layer.Tile({
                                    source: new ol.source.Stamen({
                                        layer: 'watercolor'
                                    })
                                }),
                            ]
                        }),
                        new ol.layer.Tile({
                            title: 'OSM',
                            type: 'base',
                            visible: true,
                            source: new ol.source.OSM()
                        })
                    ]
                }),
                new ol.layer.Group({
                    title: 'Overlays',
                    layers: [
                        new ol.layer.VectorLayer({
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

var layerSwitcher = new ol.control.LayerSwitcher({
    tipLabel: 'Legende',
    groupSelectStyle: 'group'
});
map.addControl(layerSwitcher);

};