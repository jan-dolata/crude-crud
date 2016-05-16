<script type="text/template" id="crude_formTemplate">
    @include('admin.partials.save-icon-template-part')

    <%
    var list = model.id ? setup.editForm : setup.addForm;
    _.each(list, function(attr) {
    %>
        <div class="row m-sm-b">
            <div class="col-sm-4">
                <label>
                    <%- Crude.getAttrName(attr) %>
                </label>
            </div>

            <div class="col-sm-8">
                <%= Crude.renderInput(setup, attr, model) %>
            </div>
        </div>
    <% }); %>
</script>
