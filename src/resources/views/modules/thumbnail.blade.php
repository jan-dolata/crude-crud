<script type="text/template" id="crude_thumbnailTemplate">

    <% _.each(setup.get('thumbnailColumns'), function(column) { %>
        <div class="row m-sm-b">
            <div class="col-sm-4">
                <label><%- setup.getAttrName(column.name) %> </label>
            </div>
            <div class="col-sm-8">
            <label><%- setup.interfaceTrans('drop_file_here') %></label>
                <div id="upload_file_dropzone_<%- column.name %>" class="well pointer" style="background: #fafafa"></div>
            </div>
        </div>
    <% }); %>

    <% var module = 'thumbnail' %>
    @include('CrudeCRUD::modules.partials.save-icon')
</script>

<script type="text/template" id="crude_dropzoneThumbnailTemplate">
    <div class="dz-preview dz-file-preview p" style="display: inline-block">
        <div class="dz-details">
            <img data-dz-thumbnail />
            <div class="dz-filename"><span data-dz-name></span></div>
            {{-- <div class="dz-size" data-dz-size></div> --}}
        </div>

        <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
        <div class="dz-error-mark" data-dz-remove><i class="fa fa-trash"></i></div>
        <div class="dz-error-message"><span data-dz-errormessage></span></div>
    </div>
</script>
