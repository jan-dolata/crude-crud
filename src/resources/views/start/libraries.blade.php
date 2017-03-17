<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css" integrity="sha384-XdYbMnZ/QjLh6iI4ogqCTaIjrFk87ip+ekIjefZch0Y+PvJ8CDYtEs1ipDmPorQ+" crossorigin="anonymous">
<script src="https://maps.googleapis.com/maps/api/js?key={{ config('crude.googleApiKey') }}&libraries=places" async defer></script>

<link rel="stylesheet" href="{{ asset('vendor/jan-dolata/crude-crud/css/app.css') }}">

<?php
    $revManifest = json_decode(file_get_contents('vendor/jan-dolata/crude-crud/build/rev-manifest.json'), true);
?>

<script src="{{ asset('vendor/jan-dolata/crude-crud/build/' . $revManifest['js/lib.js']) }}"></script>
<script src="{{ asset('vendor/jan-dolata/crude-crud/build/' . $revManifest['js/app.js']) }}"></script>

<script type="text/javascript">
    Crude.trans['validation.attributes'] = {!! json_encode(trans('validation.attributes'), JSON_NUMERIC_CHECK) !!};
</script>
