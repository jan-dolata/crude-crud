Crude.Views.FileModule = Crude.Views.Module.extend(
{
    template: '#crude_fileTemplate',
    moduleName: 'file',

    dropzone: '',
    uploadSuccessfull: true,
    errorMesssages: [],
    maxFiles: 10,
    parallelUploads: 10,
    cleaningUp: false,

    ui: {
        save: '#save',
        cancel: '#cancel',
        loader: '#loader',
        uploadFileDropzone: '#upload_file_dropzone'
    },

    save: function() { },

    initialize: function(options)
    {
        this.moduleInitialize(options);

        this.maxFiles = options.hasOwnProperty("maxFiles") ? options.maxFiles : this.maxFiles;
        this.parallelUploads = options.hasOwnProperty("parallelUploads") ? options.parallelUploads : this.parallelUploads;
    },

    onRender: function()
    {
        this.parentOnRender();

        this.ui.save.hide(100);

        var that = this;
        this.ui.uploadFileDropzone.dropzone({
            headers: {
                'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
            },
            url: that.setup.filesRoute('upload'),
            previewTemplate: $('#crude_dropzoneTemplate').html(),
            maxFiles: that.maxFiles,
            parallelUploads: that.parallelUploads,
            uploadMultiple: true,
            autoProcessQueue: true,
            init: function()
            {
                that.dropzone = this;

                this.on("success", function(file, response)
                {
                    if (response.success && "model" in response && "files" in response.model) {
                        var fileIndex = _.findKey(response.model.files, {'file_original_name': file.name});
                        file.fileLogId = response.model.files[fileIndex].file_log_id;
                    }
                });

                this.on("successmultiple", function(file, response) {
                    if (response.hasOwnProperty("errors")) {
                        that.uploadSuccessfull = false;
                        Crude.showError(response.errors, that.alertContainer());
                    }

                    updateModelFiles(response.model.files);
                    updateFiles();

                    Crude.vent.trigger('action_update', that.setup.getName());
                });

                this.on("removedfile", function(file) {
                    if (file.hasOwnProperty('fileLogId') && !that.cleaningUp){
                        $.ajax({
                            dataType: "json",
                            type: 'delete',
                            url: that.setup.filesRoute('delete'),
                            data: {
                                file_path   : file.serverPath,
                                file_log_id : file.fileLogId,
                                crudeName   : that.setup.getName()
                            },
                            success: function(response){
                                updateModelFiles(response.model.files);

                                Crude.vent.trigger('action_update', that.setup.getName());
                            }
                        });
                    }
                });

                var updateModelFiles = function (files) {
                    that.model.set(
                        that.setup.get('fileAttrName'),
                        files
                    );
                };

                var updateFiles = function() {
                    that.cleaningUp = true;
                    that.dropzone.removeAllFiles();
                    that.cleaningUp = false;

                    var files = that.model.get(that.setup.get('fileAttrName'));
                    _.each(files, function(file, key) {
                        var dzFile = {
                            name: file.file_original_name,
                            thumb: file.path,
                            serverPath: file.path,
                            fileLogId: file.file_log_id
                        };
                        that.dropzone.emit("addedfile", dzFile);
                        that.dropzone.createThumbnailFromUrl(dzFile, dzFile.serverPath);
                        that.dropzone.files.push(dzFile);

                        that.dropzone.options.maxFiles = that.maxFiles - files.length;
                    });
                };
                updateFiles();
            },
            sending: function(file, xhr, formData) {
                formData.append("crudeName", that.setup.getName());
                formData.append("modelId", that.model.id);
            },

            dictMaxFilesExceeded: that.setup.get("dropzoneTrans")["dictMaxFilesExceeded"]
        });
    },
});
