<form class="p form-inline" method="POST" action="{{ route('special_file_upload', $key) }}" enctype="multipart/form-data">
    {{ csrf_field() }}

    <input type="file" name="file" class="form-control">

    <button type="submit" class="btn btn-default">
        <i class="fa fa-upload"></i>
    </button>
</form>
