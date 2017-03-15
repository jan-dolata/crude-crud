<form class="p" method="POST" action="{{ route('special_file_upload', $key) }}" enctype="multipart/form-data">
    {{ csrf_field() }}
    <div class="input-group">
        <input type="file" name="file" class="form-control">
        <span class="input-group-btn">
            <button type="submit" class="btn btn-default">
                <i class="fa fa-upload"></i>
            </button>
        </span>
    </div>
</form>
