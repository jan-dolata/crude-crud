$ ->
    setups = Crude.getData 'crudeSetup', []
    crudeContainer = $ '#crudeContainer'

    newModel = (setup) -> new Crude.Models.Setup setup

    newView = (setup) -> new Crude.Views.Layout
        el: '#' + setup.containerId()
        setup: setup

    newContainer = (id) -> '<div id="' + id + '" class="container"></div>'

    createView = (setup) ->
        model = newModel setup
        container = newContainer model.containerId()
        view = newView model
        crudeContainer.append container
        view.render()

    createView setup for setup in crudeSetup

    return
