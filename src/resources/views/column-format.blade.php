<script type="text/template" id="crude_defaultColumnFormatTemplate">
    <% var value = model.get(attr) %>

    <% if (_.isObject(value)) { %>
        <%=
            _.template($('#crude_objectColumnFormatTemplate').html())({
                setup: setup,
                format: format,
                attr: attr,
                model: model
            })
        %>
    <% } else { %>

        <% if (Crude.isEmail(value)) { %>
            <!-- email -->
            <%=
                _.template($('#crude_mailtoColumnFormatTemplate').html())({
                    setup: setup,
                    format: format,
                    attr: attr,
                    model: model
                })
            %>
        <% } else if (Crude.isUrl(value)) { %>
            <!-- link -->
            <%=
                _.template($('#crude_hrefColumnFormatTemplate').html())({
                    setup: setup,
                    format: format,
                    attr: attr,
                    model: model
                })
            %>
        <% } else { %>
            <!-- text -->
            <%=
                _.template($('#crude_textColumnFormatTemplate').html())({
                    setup: setup,
                    format: format,
                    attr: attr,
                    model: model
                })
            %>
        <% } %>

    <% } %>
</script>

<script type="text/template" id="crude_mailtoColumnFormatTemplate">
    <%
    var value = model.get(attr);
    var short = s.truncate(String(value), 20);
    var tooltip = value == short
        ? ''
        : 'title="' + value + '" data-toggle="tooltip" data-placement="bottom"';
    %>

    <a href="mailto:<%= value %>" target="_top" <%= tooltip %> >
        <%- short %>
    </a>
</script>

<script type="text/template" id="crude_hrefColumnFormatTemplate">
    <%
    var value = model.get(attr);
    var short = s.truncate(String(value), 20);
    var tooltip = value == short
        ? ''
        : 'title="' + value + '" data-toggle="tooltip" data-placement="bottom"';
    %>

    <a href="<%= value %>" target="_blank" <%= tooltip %> >
        <%- short %>
    </a>
</script>

<script type="text/template" id="crude_textColumnFormatTemplate">
    <%
    var value = model.get(attr);
    var short = s.truncate(String(value), 20);
    var popover = value == short
        ? ''
        : 'style="cursor: zoom-in" data-content="' + Crude.nl2br(value) + '" data-toggle="popover" data-placement="bottom"';
    %>
    <span <%= popover %> >
        <%- short %>
    </span>
</script>

<script type="text/template" id="crude_objectColumnFormatTemplate">
    <%
    var value = model.get(attr);
    var json = JSON.stringify(value, null, '  ');
    var jsonString = JSON.stringify(value);
    var jsonShort = s.truncate(String(jsonString), 20);
    %>

    <pre class="crude-pre"
        <% if (jsonString != jsonShort) { %>
            style="cursor: zoom-in"
            data-content='<pre class="crude-pre"><%= json %></pre>'
            data-toggle="popover"
            data-placement="bottom"
        <% } %>
        ><%= jsonShort %></pre>
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
    <%- model.get(attr) ? setup.interfaceTrans('yes') : setup.interfaceTrans('no') %>
</script>

<script type="text/template" id="crude_statusColumnFormatTemplate">
    <%
    var value = model.get(attr),
        format = setup.getColumnFormat(attr),
        option = _.findWhere(format.options, {id: value});
    %>
    <div class="text-center" style="padding: 2px 4px; border-radius: 2px; <%= option && ('color' in option) ? 'background:' + option.color : '' %>">
        <%- option && ('label' in option) ? option.label : '-' %>
    </div>
</script>

<script type="text/template" id="crude_integerColumnFormatTemplate">
    <%- s.numberFormat(parseInt(model.get(attr)), 0, ".", " ")  %>
</script>

<script type="text/template" id="crude_numberColumnFormatTemplate">
    <%- s.numberFormat(parseFloat(model.get(attr)), 2, ".", " ")  %>
</script>

<script type="text/template" id="crude_filesColumnFormatTemplate">
    <% files = model.get(attr) %>
    <% for (var i in files) { %>
    <%
        var max_length = 20;
        var file = files[i];
        var fileOriginalName = file.file_original_name;
        var fileDisplayName = fileOriginalName.length > max_length
            ? fileOriginalName.substring(0,max_length-1) + "..."
            : fileOriginalName;
    %>
        <div>
            <form method="post" action="{{ route('download') }}" style="display: inline">
                {{ csrf_field() }}

                <input type="hidden" name="path" value="<%= file.path %>">
                <input type="hidden" name="name" value="<%= fileOriginalName %>">

                <button type="submit" class="crude-action-btn"
                    title="<%- setup.interfaceTrans('download') %>: <%- fileDisplayName %>"
                    data-toggle="tooltip" data-placement="bottom">
                    <i class="fa fa-download m-r m-l" aria-hidden="true"></i>
                </button>
            </form>

            <a href="<%- files[i]['path'] %>" target="_blank" data-toggle="tooltip" data-placement="bottom" title="<%- fileOriginalName %>">
                <%- fileDisplayName %>
            </a>
        </div>
    <% } %>

    <% if (files.length > 1) { %>
        <a href="{{ route('download_all') }}/<%- setup.getName() %>/<%- model.get('id') %>" class="none-text-decoration">
            <button class="crude-action-btn" data-toggle="tooltip" data-placement="bottom" title="<%- setup.interfaceTrans('download') %>: <%- setup.getName() %>_<%- model.get('id') %>.zip">
                <i class="fa fa-archive m-r m-l" aria-hidden="true"></i>
            </button>
        </a>
    <% } %>
</script>
