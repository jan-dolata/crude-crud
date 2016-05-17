<script type="text/template" id="crude_mapTemplate">
    @include('CrudeCRUD::modules.partials.save-icon')

    <div class="row">
        <div class="col-xs-12">
            <input type="text" id="search" class="pac-input controls" />
            <div id="mapContainer" class="map-region box"></div>
        </div>
    </div>
    <div class="row m-t">
        <div class="col-sm-6">
            <div id="position"></div>
        </div>
        <div class="col-sm-6 text-right">
            <div id="info"></div>
        </div>
    </div>
</script>

