<script type="text/template" id="crude_textRichFilterTemplate">
    <div class="input-group m-xs-b m-xs-t">
        <span class="input-group-addon">
            <%- richFilter.label %>
        </span>

        <input
            type="text"
            class="form-control input-sm richFilterValue"
            value="<%- value %>"
            placeholder="<%- richFilter.label %>"
            data-name="<%- richFilter.name %>"
        />

        <div class="input-group-btn">
            <button type="button" class="clearRichFilter btn btn-default btn-sm" data-name="<%- richFilter.name %>">
                <i class="fa fa-times"></i>
            </button>
        </div>
    </div>
</script>

<script type="text/template" id="crude_numberRichFilterTemplate">
    <div class="input-group m-xs-b m-xs-t">
        <span class="input-group-addon">
            <%- richFilter.label %>
        </span>
        <input
            type="number"
            class="form-control input-sm richFilterValue"
            value="<%- value %>"
            placeholder="<%- richFilter.label %>"
            data-name="<%- richFilter.name %>"
            min="<%- 'min' in richFilter.options ? richFilter.options.min : '' %>"
            max="<%- 'max' in richFilter.options ? richFilter.options.max : '' %>"
            step="<%- 'step' in richFilter.options ? richFilter.options.step : '' %>"
        />

        <div class="input-group-btn">
            <button type="button" class="clearRichFilter btn btn-default btn-sm" data-name="<%- richFilter.name %>">
                <i class="fa fa-times"></i>
            </button>
        </div>
    </div>
</script>

<script type="text/template" id="crude_selectRichFilterTemplate">
    <div class="input-group m-xs-b m-xs-t">
        <span class="input-group-addon">
            <%- richFilter.label %>
        </span>

        <select
            type="select"
            class="input-sm form-control richFilterValue"
            data-name="<%- richFilter.name %>"
            placeholder="<%- richFilter.label %>"
        >
            <option value="" <%- value == "" ? 'selected' : '' %>></option>

            <% for (var i in richFilter.options) { %>
                <% var option = richFilter.options[i] %>
                <option value="<%- option.id %>" <%- value == option.id ? 'selected' : '' %>>
                    <%- option.label %>
                </option>
            <% } %>
        </select>

        <div class="input-group-btn">
            <button type="button" class="clearRichFilter btn btn-default btn-sm" data-name="<%- richFilter.name %>">
                <i class="fa fa-times"></i>
            </button>
        </div>
    </div>
</script>

<script type="text/template" id="crude_datetimeRichFilterTemplate">
    <div class="input-group m-xs-b m-xs-t">
        <span class="input-group-addon">
            <%- richFilter.label %>
        </span>

        <span>
            <input
                readonly
                type="text"
                class="form-control input-sm richFilterValue"
                value="<%- value %>"
                placeholder="<%- richFilter.label %>"
                data-name="<%- richFilter.name %>"
                style="border-radius: 0"
            />

            <button type="button" class="btn btn-default btn-sm"  style="border-radius: 0">
                <i class="fa fa-calendar"></i>
            </button>
        </span>

        <div class="input-group-btn">
            <button type="button" class="clearRichFilter btn btn-default btn-sm" data-name="<%- richFilter.name %>">
                <i class="fa fa-times"></i>
            </button>
        </div>
    </div>
</script>
