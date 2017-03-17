<script type="text/template" id="crude_textInputTemplate">
    <input type="text" class="input form-control" data-attr="<%- attr %>" value="<%- model[attr] %>" placeholder="<%- setup.getAttrName(attr) %>: <%- setup.interfaceTrans('input_placeholder', 'text') %>" />
</script>

<script type="text/template" id="crude_numberInputTemplate">
    <input type="number" class="input form-control" data-attr="<%- attr %>" value="<%- model[attr] %>" placeholder="<%- setup.getAttrName(attr) %>: <%- setup.interfaceTrans('input_placeholder', 'number') %>" />
</script>

<script type="text/template" id="crude_textareaInputTemplate">
    <textarea class="input form-control" data-attr="<%- attr %>" rows="2" placeholder="<%- setup.getAttrName(attr) %>: <%- setup.interfaceTrans('input_placeholder', 'textarea') %>"><%- model[attr] %></textarea>
</script>

<script type="text/template" id="crude_jsonInputTemplate">
    <pre class="crude-pre-textarea-container"><textarea
        type="json"
        class="input form-control"
        data-attr="<%- attr %>"
        rows="4"
        placeholder="<%- setup.getAttrName(attr) %>: <%- setup.interfaceTrans('input_placeholder', 'json') %>"
        ><%- JSON.stringify(model[attr], null, 4) %></textarea></pre>
</script>

<script type="text/template" id="crude_infoInputTemplate">
    <input type="text" readonly class="form-control" value="<%- model[attr] %>" />
</script>

<script type="text/template" id="crude_checkboxInputTemplate">
    <input type="checkbox" class="input" data-attr="<%- attr %>" <%- parseInt(model[attr]) ? 'checked' : '' %>/>
</script>

<script type="text/template" id="crude_autocompleteInputTemplate">
    <input type="text" class="autocomplete form-control" data-attr="<%- attr %>" value="" placeholder="<%- setup.getAttrName(attr) %>: <%- setup.interfaceTrans('input_placeholder', 'autocomplete') %>" />
    <input type="hidden" class="input autocompleteValue" data-attr="<%- attr %>" value="<%- model[attr] %>" />
</script>

<script type="text/template" id="crude_datetimeInputTemplate">
    <div class="datetimepicker input-group date">
        <input readonly type="text" class="input form-control" data-attr="<%- attr %>" value="<%- model[attr] %>" placeholder="<%- setup.getAttrName(attr) %>: <%- setup.interfaceTrans('input_placeholder', 'datetime') %>" />
        <div class="input-group-btn">
            <button type="button" class="btn btn-default">
                <i class="fa fa-calendar"></i>
            </button>
        </div>
    </div>
</script>

<script type="text/template" id="crude_selectInputTemplate">
    <select type="select" class="input form-control" data-attr="<%- attr %>" placeholder="<%- setup.getAttrName(attr) %>: <%- setup.interfaceTrans('input_placeholder', 'select') %>">
        <% for (var i in setup.get('selectOptions')[attr]) { %>
            <% var option = setup.get('selectOptions')[attr][i] %>
            <option value="<%- option.id %>" <%- model[attr] == option.id ? 'selected' : '' %>>
                <%- option.label %>
            </option>
        <% } %>
    </select>
</script>

<script type="text/template" id="crude_multiselectInputTemplate">
    <select multiple type="multiselect" class="input form-control" data-attr="<%- attr %>"
        placeholder="<%- setup.getAttrName(attr) %>: <%- setup.interfaceTrans('input_placeholder', 'select') %>"
        data-method="getFromMultiselectInput">

        <% for (var i in setup.get('selectOptions')[attr]) { %>
            <% var option = setup.get('selectOptions')[attr][i] %>
            <option value="<%- option.id %>" <%- model[attr] == option.id ? 'selected' : '' %>>
                <%- option.label %>
            </option>
        <% } %>

    </select>
</script>

<script type="text/template" id="crude_selectizeInputTemplate">
    <select type="selectize" class="input form-control" data-attr="<%- attr %>" placeholder="<%- setup.getAttrName(attr) %>: <%- setup.interfaceTrans('input_placeholder', 'select') %>">
        <% for (var i in setup.get('selectOptions')[attr]) { %>
            <% var option = setup.get('selectOptions')[attr][i] %>
            <option value="<%- option.id %>" <%- model[attr] == option.id ? 'selected' : '' %>>
                <%- option.label %>
            </option>
        <% } %>
    </select>
</script>

<script type="text/template" id="crude_multiselectizeInputTemplate">
    <select type="multiselectize" class="input form-control" data-attr="<%- attr %>" placeholder="<%- setup.getAttrName(attr) %>: <%- setup.interfaceTrans('input_placeholder', 'select') %>">
        <% for (var i in setup.get('selectOptions')[attr]) { %>
            <% var option = setup.get('selectOptions')[attr][i] %>
            <option value="<%- option.id %>" <%- model[attr] == option.id ? 'selected' : '' %>>
                <%- option.label %>
            </option>
        <% } %>
    </select>
</script>

<script type="text/template" id="crude_markdownInputTemplate">
    <div class="row">
        <div class="col-sm-6">
            <pre class="crude-pre-textarea-container"><textarea
                type="markdown"
                class="input form-control markdownInput"
                data-attr="<%- attr %>"
                rows="8"
                placeholder="<%- setup.getAttrName(attr) %>: <%- setup.interfaceTrans('input_placeholder', 'markdown') %>"
                ><%- model[attr] %></textarea></pre>
        </div>
        <div class="col-sm-6">
            <div class="markdownPreview" style="background: #fff"></div>
        </div>
    </div>
</script>

<div id="markdownPreviewModal" class="modal fade" role="dialog">
    <div class="modal-dialog crude-modal" style="width: 80%">
        <div class="modal-content"></div>
    </div>
</div>

<script type="text/template" id="crude_markdownPreviewModalTemplate">
    <div class="modal-header">
        {{ trans('CrudeCRUD::crude.markdown_preview') }}
    </div>
    <div class="modal-body">
        <div class="content">
            <%= content %>
            <hr>
            <div class="text-right">
                <button class="crude-action-btn" data-dismiss="modal">
                    <%= _.template($('#crude_closePreviewActionButtonTemplate').html())({
                        setup: setup
                    }) %>
                </button>
            </div>
        </div>
    </div>
</script>
