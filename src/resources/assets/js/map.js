Crude.Views.Map = Backbone.Marionette.ItemView.extend(
{
    template: '#crude_mapTemplate',
    tagName: 'div',

    updateTime: '',
    firstCount: null,
    markers: [],

    map: null,
    geocoder: null,
    infowindow: null,

    ui: {
        mapContainer: '#mapContainer'
    },

    initialize: function (options)
    {
        this.setup = options.setup;

        this.collection = this.setup.getNewCollection();
        this.updateList();

        this.listenTo(Crude.vent, 'action_update', this.updateThisList);
        this.listenTo(Crude.vent, 'rich_filters_change', this.richFiltersChange);
    },

    serializeData: function ()
    {
        return {
            setup: this.setup
        };
    },

    onRender: function ()
    {
        // initialize all tooltips on a page
        $('[data-toggle="tooltip"]').tooltip();

        Crude.whenAvailable("google", function() {
            this.initMap();
        }.bind(this));
    },

    initMap: function ()
    {
        this.map = new google.maps.Map(this.ui.mapContainer[0], {
            center: this.setup.config('mapCenter'),
            zoom: 6
        });

        this.geocoder = new google.maps.Geocoder;
        this.infowindow = new google.maps.InfoWindow;

        this.showMarkers();
    },

    addMarker: function (model)
    {
        var latLngObject = model.getLatLngObject();
        var title = [
            model.get('map_address'),
            model.get('map_postal_code') + ' ' + model.get('map_locality'),
            model.get('map_province'),
            model.get('map_lat') + ' : ' + model.get('map_lng')
        ].join('; ');

        var newLength = this.markers.push(
            new google.maps.Marker({
                map: this.map,
                position: latLngObject,
                title: title
            })
        );

        var marker = this.markers[newLength - 1];
        var data = {
            model: model,
            setup: this.setup
        };

        marker.addListener('click', function() {
            this.showInfo(marker, data);
        }.bind(this));
    },

    removeAllMarkers: function ()
    {
        _.each(this.markers, function(item) {
            item.setMap(null);
        });

        this.markers = [];
    },

    showInfo: function (marker, data)
    {
        var infowindowTemplate = _.template($('#crude_mapInfowindowTemplate').html());

        this.geocoder.geocode({'location': marker.getPosition()}, function(results, status) {
            if (status !== google.maps.GeocoderStatus.OK)
                return;

            data.address = results[0].formatted_address;
            this.infowindow.setContent(infowindowTemplate(data));
            this.infowindow.open(this.map, marker);
        }.bind(this));
    },

    showMarkers: function()
    {
        this.removeAllMarkers();

        this.collection.each(function(model) {
            if (model.hasLatLngObject())
                this.addMarker(model);
        }.bind(this));
    },

    updateList: function ()
    {
        if (this.firstCount != null)
            this.collection.pagination.numRows = this.firstCount;

        this.collection.fetchWithOptions().done(function (response)
        {
            Crude.vent.trigger('fetched_completed');
            this.updateTime = Date.now();

            if (this.firstCount == null)
                this.firstCount = this.collection.pagination.count;

            this.showMarkers();
        }.bind(this));
    },

    updateThisList: function (setupName)
    {
        if (this.setup.getName() == setupName || this.setup.config('refreshAll'))
            this.updateList();
    },

    richFiltersChange: function (setupName, richFilters)
    {
        if (this.setup.getName() == setupName) {
            this.collection.richFilters = richFilters;
            this.updateList();
        }
    }

});
