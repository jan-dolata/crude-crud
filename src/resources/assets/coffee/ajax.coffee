ajax =
    post: (url, data = {}, success, fail, ...) ->
        @send 'POST', url, data, success, fail
    get: (url, data = {}, success, fail, ...) ->
        @send 'GET', url, data, success, fail

    send: (method, url, data, success, fail, ...) ->
        @success = success ? (response) -> @
        @fail = fail ? (response) -> @

        httpRequest = new XMLHttpRequest()
        if ! httpRequest
            alert 'Giving up :( Cannot create an XMLHTTP instance'
            retun false

        httpRequest.onreadystatechange = @alertContents
        httpRequest.open method, url
        httpRequest.send()
        @

    alertContents: ->
        try
            if httpRequest.readyState == XMLHttpRequest.DONE
                if httpRequest.status == 200
                    return @success httpRequest.responseText
                @fail httpRequest.responseText
        catch e
            alert 'Caught Exception: ' + e.description
