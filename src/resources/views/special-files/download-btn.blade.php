@if ($file['data'])
    <a href="{{ route('special_file_download', $file['key']) }}" class="btn">
        <i class="fa fa-download"></i>
    </a>
@else
    <div class="btn">
        <i class="fa fa-ban"></i>
    </div>
@endif
