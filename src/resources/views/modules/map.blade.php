<script type="text/template" id="crude_mapTemplate">
    @include('CrudeCRUD::modules.partials.save-icon')

    <div class="row">
        <div class="col-xs-12">
            <input type="text" id="search" class="pac-input controls" />
            <div id="mapRegion" class="map-region box"></div>
        </div>
    </div>
    <div class="row m-t">
        <div class="col-sm-6">
            <div id="positionRegion"></div>
        </div>
        <div class="col-sm-6 text-right">
            <div id="infoRegion"></div>
        </div>
    </div>
</script>

