@include('partials.modal')
@include('partials.alert')

@include('view-templates.list')
@include('view-templates.input')
@include('view-templates.form')
@include('view-templates.map')
@include('view-templates.file')

@include('view-templates.layout')




<script type="text/template" id="crude_layoutTemplate">

</script>


@include('layouts.partials.doctype')

<head>
    @include('layouts.partials.head-meta')
    @include('layouts.partials.head-title')

    <link rel="stylesheet" href="{{ elixir('css/app.css') }}">
    <script src="{{ elixir('js/lib.js') }}"></script>
    <script src="{{ elixir('js/app.js') }}"></script>
    <script src="{{ elixir('js/admin.js') }}"></script>

    @include('layouts.partials.assign-data-to-js')
    @include('layouts.partials.one-bit-bug')

    <script src="https://maps.googleapis.com/maps/api/js?key={{ env('GOOGLE_API_KEY') }}&libraries=places" async defer></script>
</head>

<body class="admin">
    @if(Auth::user())
        @include('admin.navbar.navbar')

        @include('layouts.partials.show-alert')

        <div class="container m-b">
            <div class="m-t">
                <h4>{{ trans('titles.' . Route::currentRouteName()) }}</h4>
                <div id="formContainer" style="display: none"></div>
                <div id="mapContainer" style="display: none"></div>
                <div id="fileContainer" style="display: none"></div>
                <hr>
            </div>

            <div class="m-t">
                <table id="listContainer" class="table table-hover"></table>
            </div>
        </div>
    @endif

    <div class="container m-b">
        @yield('content')
        @include('layouts.partials.version')
    </div>

    @yield('scripts')

    @include('layouts.partials.modal')

    @include('admin.partials.list-template')
    @include('admin.partials.input-template')
    @include('admin.partials.form-template')
    @include('admin.partials.map-template')
    @include('admin.partials.file-template')

</body>

</html>
