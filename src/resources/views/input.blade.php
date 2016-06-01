<script type="text/template" id="crude_textInputTemplate">
    <input type="text" class="input form-control" data-attr="<%- attr %>" value="<%- model[attr] %>" placeholder="<%- setup.getAttrName(attr) %>: {{ trans('CrudeCRUD::crude.input_placeholder.text') }}" />
</script>

<script type="text/template" id="crude_numberInputTemplate">
    <input type="number" class="input form-control" data-attr="<%- attr %>" value="<%- model[attr] %>" placeholder="<%- setup.getAttrName(attr) %>: {{ trans('CrudeCRUD::crude.input_placeholder.number') }}" />
</script>

<script type="text/template" id="crude_textareaInputTemplate">
    <textarea class="input form-control" data-attr="<%- attr %>" rows="2" placeholder="<%- setup.getAttrName(attr) %>: {{ trans('CrudeCRUD::crude.input_placeholder.textarea') }}"><%- model[attr] %></textarea>
</script>

<script type="text/template" id="crude_jsonInputTemplate">
    <pre><textarea type="json" class="input form-control" data-attr="<%- attr %>" rows="4" placeholder="<%- setup.getAttrName(attr) %>: {{ trans('CrudeCRUD::crude.input_placeholder.json') }}"><%- JSON.stringify(model[attr], null, 4) %></textarea></pre>
</script>

<script type="text/template" id="crude_infoInputTemplate">
    <input type="text" readonly class="form-control" value="<%- model[attr] %>" />
</script>

<script type="text/template" id="crude_checkboxInputTemplate">
    <input type="checkbox" class="input" data-attr="<%- attr %>" <%- parseInt(model[attr]) ? 'checked' : '' %>/>
</script>

<script type="text/template" id="crude_autocompleteInputTemplate">
    <input type="text" class="autocomplete form-control" data-attr="<%- attr %>" value="" placeholder="<%- setup.getAttrName(attr) %>: {{ trans('CrudeCRUD::crude.input_placeholder.autocomplete') }}" />
    <input type="hidden" class="input autocompleteValue" data-attr="<%- attr %>" value="<%- model[attr] %>" />
</script>

<script type="text/template" id="crude_datetimeInputTemplate">
    <div class="datetimepicker input-group date">
        <input readonly type="text" class="input form-control" data-attr="<%- attr %>" value="<%- model[attr] %>" placeholder="<%- setup.getAttrName(attr) %>: {{ trans('CrudeCRUD::crude.input_placeholder.datetime') }}" />
        <div class="input-group-btn">
            <button type="button" id="clearSearch" class="btn btn-default">
                <i class="fa fa-calendar"></i>
            </button>
        </div>
    </div>
</script>

<script type="text/template" id="crude_selectInputTemplate">
    <select type="select" class="input form-control" data-attr="<%- attr %>" placeholder="<%- setup.getAttrName(attr) %>: {{ trans('CrudeCRUD::crude.input_placeholder.select') }}">
        <% for (var i in setup.get('selectOptions')[attr]) { %>
            <% var option = setup.get('selectOptions')[attr][i] %>
            <option value="<%- option.id %>" <%- model[attr] == option.id ? 'selected' : '' %>>
                <%- option.label %>
            </option>
        <% } %>
    </select>

</script>
