<script type="text/template" id="crude_textColumnFormatTemplate">
    <% value = model.get(attr) %>
    <% if (_.isObject(value)) { %>
        <%- value.length %>
    <% } else { %>
        <%- s.truncate(String(value), 20) %>
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
    <%
        max_length = 10;
        file_display_name = files[i]['file_original_name'].length > max_length
            ? files[i]['file_original_name'].substring(0,max_length-1)+"..."
            : files[i]['file_original_name'];
    %>
        <div>
            <a href="<%- files[i]['path'] %>" target="_blank"
            data-toggle="tooltip" data-placement="top" title="<%- files[i]['file_original_name'] %>"
            >
                <sub><i class="fa fa-external-link"></i></sub>
                <%- file_display_name %>
            </a>
        </div>
    <% } %>
</script>
