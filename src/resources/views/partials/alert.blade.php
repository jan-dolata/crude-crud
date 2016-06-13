<div id="crude_alertContainer" class="container"></div>

<script type="text/template" id="crude_alertTemplate">
    <div class="alert alert-<%- type %> alert-dismissible crude-alert" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
        <%= msg %>
    </div>
</script>
