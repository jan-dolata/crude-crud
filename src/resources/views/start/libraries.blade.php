<link rel="stylesheet" href="{{ asset('vendor/jan-dolata/crude-crud/css/app.css') }}">
<script src="{{ asset('vendor/jan-dolata/crude-crud/js/lib.js') }}"></script>
<script src="{{ asset('vendor/jan-dolata/crude-crud/js/app.js') }}"></script>

<script type="text/javascript">
    Crude.trans['crude.action'] = {!! json_encode(trans('CrudeCRUD::crude.action'), JSON_NUMERIC_CHECK) !!};
    Crude.trans['validation.attributes'] = {!! json_encode(trans('validation.attributes'), JSON_NUMERIC_CHECK) !!};
</script>

