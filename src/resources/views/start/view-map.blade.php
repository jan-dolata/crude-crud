<div id="crudeMapContainer" class="crude-container"></div>

<script type="text/javascript">
    Crude.data.crudeMap = {!! empty($crudeMap) ? '{}' : json_encode($crudeMap, JSON_NUMERIC_CHECK) !!};
</script>
