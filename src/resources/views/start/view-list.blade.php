<div id="crudeContainer" class="crude-container"></div>

<script type="text/javascript">
    Crude.data.crudeSetup = {!! empty($crudeSetup) ? '{}' : json_encode($crudeSetup, JSON_NUMERIC_CHECK) !!};
</script>
