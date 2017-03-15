<div id="crudeFormContainer" class="crude-container"></div>

<script type="text/javascript">
    Crude.data.crudeForm = {!! empty($crudeForm) ? '{}' : json_encode($crudeForm, JSON_NUMERIC_CHECK) !!};
</script>
