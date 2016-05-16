@include('CrudeCRUD::partials.modal')
@include('CrudeCRUD::partials.alert')

@include('CrudeCRUD::list')
@include('CrudeCRUD::input')
@include('CrudeCRUD::modules.form')
@include('CrudeCRUD::modules.map')
@include('CrudeCRUD::modules.file')

@include('CrudeCRUD::layout')

<link rel="stylesheet" href="{{ asset('vendor/jan-dolata/crude-crud/css/app.css') }}">
<script src="{{ asset('vendor/jan-dolata/crude-crud/js/lib.js') }}"></script>
<script src="{{ asset('vendor/jan-dolata/crude-crud/js/app.js') }}"></script>
<script src="https://maps.googleapis.com/maps/api/js?key={{ env('GOOGLE_API_KEY') }}&libraries=places" async defer></script>