$(function()
{
    var crudeSetup = Crude.getData('crudeSetup', []);
    var $crudeContainer = $('#crudeContainer');

    _.each(crudeSetup, function(setup)
    {
        var setup = new Crude.Models.Setup(setup);

        $crudeContainer.append(
            '<div id="' + setup.containerId() + '" class="container"></div>'
        );

        var view = new Crude.Views.Layout({
            el: '#' + setup.containerId(),
            setup: setup
        });
        view.render();
    });
});
