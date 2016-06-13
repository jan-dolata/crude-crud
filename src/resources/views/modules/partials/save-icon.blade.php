<div class="m-md-b">
    <% if (model.id) { %>
        {{ trans('CrudeCRUD::crude.edit_mode') }}: {{ trans('validation.attributes.id') }} <%- model.id %>
    <% } else { %>
        {{ trans('CrudeCRUD::crude.add_mode') }}:
    <% } %>

    <div class="pull-right">
        <button id="save" title="{{ trans('CrudeCRUD::crude.save') }}" class="crude-action-btn" data-toggle="tooltip" data-placement="bottom">
            <%= $('#crude_saveActionButtonTemplate').html() %>
        </button>

        <button id="cancel" title="{{ trans('CrudeCRUD::crude.close') }}" class="crude-action-btn" data-toggle="tooltip" data-placement="bottom">
            <%= $('#crude_cancelActionButtonTemplate').html() %>
        </button>
    </div>
</div>



