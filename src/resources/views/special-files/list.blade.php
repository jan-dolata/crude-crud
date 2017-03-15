<?php $crudeSpecialFiles = (new JanDolata\CrudeCRUD\Engine\Helpers\CrudeSpecialFiles)->getList() ?>

<div class="crude-container">
    <div class="crude-box container p-lg-t p-lg-b">
        @foreach ($crudeSpecialFiles as $key => $file)
            <div class="row">
                <div class="col-sm-7">
                    <div class="p">
                        @include('CrudeCRUD::special-files.download-btn', ['file' => $file])
                        @include('CrudeCRUD::special-files.label-with-info', ['file' => $file])
                    </div>
                </div>

                <div class="col-sm-5">
                    @include('CrudeCRUD::special-files.upload-form', ['key' => $key])
                </div>
            </div>
        @endforeach
    </div>
</div>
