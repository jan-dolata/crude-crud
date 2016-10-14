Crude.Views.FileModule = Crude.Views.Module.extend(
{
    template: '#crude_fileTemplate',
    moduleName: 'file',

    dropzone: '',
    uploadSuccessfull: true,
    errorMesssages: [],
    maxFiles: 10,
    parallelUploads: 10,

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
                    var fileIndex = _.findKey(response.model.files, {'file_original_name': file.name});
                    file.fileLogId = response.model.files[fileIndex].file_log_id;

                    if (! response.success) {
                        that.uploadSuccessfull = false;
                        that.errorMessages = response.errors.file;
                        return;
                    }

                    Crude.vent.trigger('action_update', that.setup.getName());
                });

                this.on("queuecomplete", function()
                {
                    if (! that.uploadSuccessfull) {
                        _.each(that.errorMessages, function(error){
                            that.dropzone.removeAllFiles();
                            Crude.showError(error, that.alertContainer());
                        });

                        that.errorMessages = [];
                        return;
                    }

                    Crude.vent.trigger('action_update', that.setup.getName());
                });

                this.on("removedfile", function(file) {
                    if (file.hasOwnProperty('fileLogId')){
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
                                that.model = response.model;

                                Crude.vent.trigger('action_update', that.setup.getName());
                            }
                        });
                    }
                });

                _.each(that.model.get(that.setup.get('fileAttrName')), function(file, key) {
                    var dzFile = {
                        name: file.file_original_name,
                        thumb: file.path,
                        serverPath: file.path,
                        fileLogId: file.file_log_id
                    };
                    that.dropzone.emit("addedfile", dzFile);
                    that.dropzone.createThumbnailFromUrl(dzFile, dzFile.serverPath);

                    var existingFileCount = 1; // The number of files already uploaded

                    that.dropzone.options.maxFiles = that.dropzone.options.maxFiles - existingFileCount;
                });
            },
            sending: function(file, xhr, formData) {
                formData.append("crudeName", that.setup.getName());
                formData.append("modelId", that.model.id);
            },
            maxfilesexceeded: function(file) {
                this.removeAllFiles();
                this.addFile(file);
            }
        });
    },
});
