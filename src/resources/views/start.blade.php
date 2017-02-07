@include('CrudeCRUD::partials.alert')
@include('CrudeCRUD::partials.modal')

<div id="crudeContainer" class="crude-container"></div>

@include('CrudeCRUD::action-button')
@include('CrudeCRUD::column-format')
@include('CrudeCRUD::list')
@include('CrudeCRUD::input')
@include('CrudeCRUD::rich-filter')
@include('CrudeCRUD::modules.form')
@include('CrudeCRUD::modules.map')
@include('CrudeCRUD::modules.file')
@include('CrudeCRUD::modules.thumbnail')
@include('CrudeCRUD::layout')

<link rel="stylesheet" href="{{ asset('vendor/jan-dolata/crude-crud/css/app.css') }}">

<?php
    $revManifest = json_decode(file_get_contents('vendor/jan-dolata/crude-crud/build/rev-manifest.json'), true);
?>

<script src="{{ asset('vendor/jan-dolata/crude-crud/build/' . $revManifest['js/lib.js']) }}"></script>
<script src="{{ asset('vendor/jan-dolata/crude-crud/build/' . $revManifest['js/app.js']) }}"></script>

<script type="text/javascript">
    Crude.data.crudeSetup = {!! empty($crudeSetup) ? '{}' : json_encode($crudeSetup, JSON_NUMERIC_CHECK) !!};
    Crude.trans['validation.attributes'] = {!! json_encode(trans('validation.attributes'), JSON_NUMERIC_CHECK) !!};
</script>
