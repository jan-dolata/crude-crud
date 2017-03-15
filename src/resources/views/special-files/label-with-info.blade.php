@if ($file['data'])
    <span class="p">
        {{ $file['label'] }}
    </span>
    <small>
        .{{ $file['data']['extension'] }};
        {{ number_format((int) $file['data']['size'] / 1024, 2, '.', ' ') }} KB;
        {{ date('Y-m-d H:i:s', $file['data']['lastModified']) }}
    </small>
@else
    <span class="p bg-danger">
        {{ $file['label'] }}
    </span>
@endif
