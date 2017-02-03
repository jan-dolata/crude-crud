$(function()
{
    var crudeSetup = Crude.getData('crudeSetup', []);
    var $crudeContainer = $('#crudeContainer');

    _.each(crudeSetup, function(setup)
    {
        var setup = new Crude.Models.Setup(setup);

        var panelClass = setup.get('panelView') ? ' crude-box-panel' : '';

        $crudeContainer.append(
            '<div id="' + setup.containerId() + '" class="container crude-box' + panelClass + '"></div>'
        );

        var view = new Crude.Views.Layout({
            el: '#' + setup.containerId(),
            setup: setup
        });
        view.render();
    });

    // initialize all tooltips on a page
    $('[data-toggle="tooltip"]').tooltip();
});
