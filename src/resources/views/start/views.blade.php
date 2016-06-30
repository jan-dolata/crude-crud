<div id="crudeContainer" class="crude-container"></div>

<script type="text/javascript">
    Crude.data.crudeSetup = {!! empty($crudeSetup) ? '{}' : json_encode($crudeSetup, JSON_NUMERIC_CHECK) !!};
    Crude.trans['crude.action'] = {!! json_encode(trans('CrudeCRUD::crude.action'), JSON_NUMERIC_CHECK) !!};
    Crude.trans['validation.attributes'] = {!! json_encode(trans('validation.attributes'), JSON_NUMERIC_CHECK) !!};
</script>
