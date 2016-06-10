<script type="text/template" id="crude_textColumnFormatTemplate">
    <% value = model.get(attr) %>
    <% if (_.isObject(value)) { %>
        <%- value.length %>
    <% } else { %>
        <%- String(value).substring(0, 40) %>
        <%= String(value).length > 40 ? '...' : '' %>
    <% } %>
</script>

<script type="text/template" id="crude_longtextColumnFormatTemplate">
    <%- model.get(attr) %>
</script>

<script type="text/template" id="crude_linkColumnFormatTemplate">
    <a
        href="<%- format.url %>/<%- model.get(format.attr) %>"
        data-toggle="tooltip"
        data-placement="bottom"
        title="<%- format.title ? format.title : format.url %>"
        >
        <sub><i class="fa fa-external-link"></i></sub>
        <%- model.get(attr) %>
    </a>
</script>

<script type="text/template" id="crude_boolColumnFormatTemplate">
    <%- model.get(attr) ? '{{ trans('CrudeCRUD::crude.yes') }}' : '{{ trans('CrudeCRUD::crude.no') }}' %>
</script>

<script type="text/template" id="crude_filesColumnFormatTemplate">
    <% files = model.get(attr) %>
    <% for (var i in files) { %>
        <div>
            <a href="<%- files[i]['path'] %>" target="_blank">
                <sub><i class="fa fa-external-link"></i></sub>
                <%- files[i]['file_original_name'] %>
            </a>
        </div>
    <% } %>
</script>
