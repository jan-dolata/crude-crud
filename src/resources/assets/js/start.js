$(function()
{
    // lists
    var crudeSetup = Crude.getData('crudeSetup', []);
    var $crudeContainer = $('#crudeContainer');

    _.each(crudeSetup, function(setup)
    {
        var setup = new Crude.Models.Setup(setup);

        var panelClass = setup.get('panelView') ? ' crude-box-panel' : '';
        var containerId = setup.containerId();

        $crudeContainer.append(
            '<div id="' + containerId + '" class="container crude-box' + panelClass + '"></div>'
        );

        var view = new Crude.Views.Layout({
            el: '#' + containerId,
            setup: setup
        });
        view.render();
    });

    // map
    var crudeMap = Crude.getData('crudeMap', []);
    var $crudeMapContainer = $('#crudeMapContainer');

    _.each(crudeMap, function(setup)
    {
        var setup = new Crude.Models.Setup(setup);

        var containerId = setup.mapContainerId();

        $crudeContainer.append(
            '<div id="' + containerId + '" class="container crude-box"></div>'
        );

        var view = new Crude.Views.MapLayout({
            el: '#' + containerId,
            setup: setup
        });
        view.render();
    });

    // forms
    var crudeForm = Crude.getData('crudeForm', []);
    var $crudeFormContainer = $('#crudeFormContainer');

    _.each(crudeForm, function(form)
    {
        if (! 'setup' in form)
            return;

        var setup = new Crude.Models.Setup(form.setup);
        var containerId = setup.formContainerId();
        var modelData = 'model' in form ? form.model : {};

        $crudeFormContainer.append(
            '<div id="' + containerId + '" class="container crude-box"></div>'
        );

        var view = new Crude.Views.FormLayout({
            el: '#' + containerId,
            setup: setup,
            modelData: modelData
        });
        view.render();
    });

    // initialize all tooltips on a page
    $('[data-toggle="tooltip"]').tooltip();
});
