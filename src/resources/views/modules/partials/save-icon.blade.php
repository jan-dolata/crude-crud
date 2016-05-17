<div class="text-right m-sm-t m-sm-b">
    <label class="m-lg-r">
        <% if (model.id) { %>
            {{ trans('CrudeCRUD::crude.edit') }}: {{ trans('validation.attributes.id') }} <%- model.id %>
        <% } else { %>
            {{ trans('CrudeCRUD::crude.add') }}:
        <% } %>
    </label>
    <i id="save" class="fa fa-lg fa-save pointer m-r" title="{{ trans('CrudeCRUD::crude.save') }}"></i>
    <i id="cancel" class="fa fa-lg fa-times pointer" title="{{ trans('CrudeCRUD::crude.cancel') }}"></i>
</div>
