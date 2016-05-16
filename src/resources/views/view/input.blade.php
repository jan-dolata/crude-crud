<script type="text/template" id="crude_textInputTemplate">
    <input type="text" class="input form-control" data-attr="<%- attr %>" value="<%- model[attr] %>" placeholder="<%- Helper.getAttrName(attr) %>: {{ trans('admin.input_placeholder.text') }}" />
</script>

<script type="text/template" id="crude_numberInputTemplate">
    <input type="number" class="input form-control" data-attr="<%- attr %>" value="<%- model[attr] %>" placeholder="<%- Helper.getAttrName(attr) %>: {{ trans('admin.input_placeholder.number') }}" />
</script>

<script type="text/template" id="crude_textareaInputTemplate">
    <textarea class="input form-control" data-attr="<%- attr %>" rows="2" placeholder="<%- Helper.getAttrName(attr) %>: {{ trans('admin.input_placeholder.textarea') }}"><%- model[attr] %></textarea>
</script>

<script type="text/template" id="crude_infoInputTemplate">
    <input readonly class="form-control" value="<%- model[attr] %>" />
</script>

<script type="text/template" id="crude_checkboxInputTemplate">
    <input type="checkbox" class="input" data-attr="<%- attr %>" <%- parseInt(model[attr]) ? 'checked' : '' %>/>
</script>

<script type="text/template" id="crude_autocompleteInputTemplate">
    <input type="text" class="autocomplete form-control" data-attr="<%- attr %>" value="" placeholder="<%- Helper.getAttrName(attr) %>: {{ trans('admin.input_placeholder.autocomplete') }}" />
    <input type="hidden" class="input autocompleteValue" data-attr="<%- attr %>" value="<%- model[attr] %>" />
</script>

<script type="text/template" id="crude_datetimeInputTemplate">
    <div class="datetimepicker input-group date">
        <input readonly type="text" class="input form-control" data-attr="<%- attr %>" value="<%- model[attr] %>" placeholder="<%- Helper.getAttrName(attr) %>: {{ trans('admin.input_placeholder.datetime') }}" />
        <div class="input-group-btn">
            <button type="button" id="clearSearch" class="btn btn-default">
                <i class="fa fa-calendar"></i>
            </button>
        </div>
    </div>
</script>