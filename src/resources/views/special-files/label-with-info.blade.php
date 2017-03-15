@if ($file['data'])
    <span class="p">
        {{ $file['label'] }}
    </span>
    <small class="m-l">
        .{{ $file['data']['extension'] }};
        {{ number_format((int) $file['data']['size'] / 1024, 2, '.', ' ') }} KB;
        {{ date('Y-m-d H:i:s', $file['data']['lastModified']) }};
        #{{ $file['key']  }}
    </small>
@else
    <span class="p bg-danger">
        {{ $file['label'] }}
    </span>
    <small class="m-l">
        #{{ $file['key']  }}
    </small>
@endif
