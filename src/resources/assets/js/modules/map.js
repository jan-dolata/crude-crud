Crude.Views.MapModule = Crude.Views.Module.extend(
{
    template: '#crude_mapTemplate',
    moduleName: 'map',

    map: null,
    geocoder: null,
    selectedLocation: null,

    ui: {
        save: '#save',
        cancel: '#cancel',
        clear: '#clear',
        input: '.input',
        loader: '#loader',
        'mapContainer': '#mapContainer',
        'info': '#info',
        'position': '#position',
        'search': '#search',
    },

    initialize: function (options)
    {
        this.moduleInitialize(options);

        this.listenTo(Crude.vent, 'slide_down_finished', this.refreshMap);
    },

    onRender: function ()
    {
        this.parentOnRender();

        this.whenAvailable("google", function() {
            this.initMap();
        }.bind(this));
    },

    whenAvailable: function (name, callback) {
        var interval = 10; // ms
        var that = this;

        if (window[name])
            callback();
        else
            window.setTimeout(function() {
                if (window[name])
                    callback();
                else
                    window.setTimeout(that.whenAvailable(name, callback), interval);
            }, interval);
    },

    save: function ()
    {
        this.saveModel();
    },

    initMap: function () {
        this.map = new google.maps.Map(this.ui.mapContainer[0], {
            center: this.getMapCenter(),
            zoom: 6
        });

        var marker = null;

        if (this.model.hasLatLngObject()) {
            marker = this.showNewMarker();
            this.showSelectedLocation();
        }

        this.map.addListener('click', function(event) {
            this.model.set('map_lat', event.latLng.lat());
            this.model.set('map_lng', event.latLng.lng());
            this.showSelectedLocation();

            if (marker == null)
                marker = this.showNewMarker();
            else
                marker.setPosition(this.model.getLatLngObject());
        }.bind(this));

        this.bindSearch();
    },

    getMapCenter: function () {
        return this.model.hasLatLngObject()
            ? this.model.getLatLngObject()
            : this.setup.config('mapCenter');
    },

    showNewMarker: function () {
        return new google.maps.Marker({
            map: this.map,
            position: this.model.getLatLngObject()
        });
    },

    refreshMap: function (name) {
        if (name != this.setup.getName())
            return;

        google.maps.event.trigger(this.map, 'resize');
        this.map.setCenter(this.getMapCenter());
    },

    showSelectedLocation: function()
    {
        this.ui.position.html(this.model.get('map_lat') + ' x ' + this.model.get('map_lng'));

        var geocoder = new google.maps.Geocoder;

        geocoder.geocode({'location': this.model.getLatLngObject()}, function(results, status) {
            this.ui.info.html('');

            if (status !== google.maps.GeocoderStatus.OK)
                return;

            this.ui.info.html(results[0].formatted_address);

            var components = results[0].address_components;
            this.model.set('map_postal_code', this.getComponentOfSelectedLocation(components, 'postal_code'));
            this.model.set('map_province', this.getComponentOfSelectedLocation(components, 'administrative_area_level_1'));
            this.model.set('map_locality', this.getComponentOfSelectedLocation(components, 'locality'));

            var street = this.getComponentOfSelectedLocation(components, 'route');
            var streetNumber = this.getComponentOfSelectedLocation(components, 'street_number');
            var number = streetNumber == '' ? '' : ' ' + streetNumber;

            this.model.set('map_address', street + number);
        }.bind(this));
    },

    getComponentOfSelectedLocation: function (components, type) {
        for (var i in components) {
            var component = components[i];

            var isOneOfType = _.filter(component.types, function (cType) {
                return cType == type;
            }).length > 0;

            if (isOneOfType)
                return component.long_name;
        }

        return '';
    },

    clear: function () {
        this.model.set('map_lat', null)
        this.model.set('map_lng', null)
        this.model.set('map_postal_code', null);
        this.model.set('map_province', null);
        this.model.set('map_locality', null);
        this.model.set('map_address', null);

        this.saveModel();
    },

    /**
     * Example from https://developers.google.com/maps/documentation/javascript/examples/places-searchbox
     */
    bindSearch: function()
    {
        var input = this.ui.search[0];
        var map = this.map;

        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        map.addListener('bounds_changed', function() {
            searchBox.setBounds(map.getBounds());
        }.bind(this));

        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
            var places = searchBox.getPlaces();

            if (places.length == 0) {
                return;
            }

            // Clear out the old markers.
            markers.forEach(function(marker) {
                marker.setMap(null);
            });
            markers = [];

            // For each place, get the icon, name and location.
            var bounds = new google.maps.LatLngBounds();
            places.forEach(function(place) {
                var icon = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                };

                // Create a marker for each place.
                markers.push(new google.maps.Marker({
                    map: map,
                    icon: icon,
                    title: place.name,
                    position: place.geometry.location
                }));

                if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
            });
            map.fitBounds(bounds);
        });
    },
});
