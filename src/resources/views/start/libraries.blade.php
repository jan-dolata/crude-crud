<link rel="stylesheet" href="{{ asset('vendor/jan-dolata/crude-crud/css/app.css') }}">

<?php
    $revManifest = json_decode(file_get_contents('vendor/jan-dolata/crude-crud/build/rev-manifest.json'), true);
?>

<script src="{{ asset('vendor/jan-dolata/crude-crud/build/' . $revManifest['js/lib.js']) }}"></script>
<script src="{{ asset('vendor/jan-dolata/crude-crud/build/' . $revManifest['js/app.js']) }}"></script>

<script type="text/javascript">
    Crude.trans['crude.action'] = {!! json_encode(trans('CrudeCRUD::crude.action'), JSON_NUMERIC_CHECK) !!};
    Crude.trans['validation.attributes'] = {!! json_encode(trans('validation.attributes'), JSON_NUMERIC_CHECK) !!};
</script>
