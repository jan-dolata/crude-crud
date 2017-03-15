<script type="text/template" id="crude_formModuleTemplate">
    <%
    var list = model.id ? setup.get('editForm') : setup.get('addForm');
    _.each(list, function(attr) {
    %>
        <div class="row m-sm-b">
            <div class="col-sm-4">
                <label>
                    <%- setup.getAttrName(attr) %>
                </label>
            </div>

            <div class="col-sm-8">
                <%= Crude.renderInput(setup, attr, model) %>
            </div>
        </div>
    <% }); %>

    <% var module = 'form' %>
    @include('CrudeCRUD::modules.partials.save-icon')
</script>
