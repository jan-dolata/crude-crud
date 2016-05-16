Crude.Views.File = Crude.Views.Module.extend(
{
    template: '#fileTemplate',
    moduleName: 'file',

    dropzone: '',
    uploadSuccessfull: true,
    errorMesssages: [],

    ui: {
        save: '#save',
        cancel: '#cancel',
        uploadFileDropzone: '#upload_file_dropzone'
    },

    save: function()
    {
        this.dropzone.processQueue();
    },

    onRender: function()
    {
        var that = this;
        this.ui.uploadFileDropzone.dropzone({
            headers: {
                'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
            },
            url: "/files-upload",
            maxFiles: 10,
            parallelUploads: 10,
            previewTemplate: $('#dropzoneTemplate').html(),
            uploadMultiple: true,
            autoProcessQueue: false,
            init: function()
            {
                that.dropzone = this;

                this.on("success", function(file, response)
                {
                    if (! response.success) {
                        that.uploadSuccessfull = false;
                        that.errorMessages = response.errors.file;
                        return;
                    }
                    that.setup.triggerNextAction(that.model);
                });

                this.on("queuecomplete", function()
                {
                    if (! that.uploadSuccessfull) {
                        _.each(that.errorMessages, function(error){
                            that.dropzone.removeAllFiles();
                            Crude.showError(error);
                        });

                        that.errorMessages = [];
                        return;
                    }

                    that.slideUp();
                });

                this.on("removedfile", function(file) {
                    if (file.hasOwnProperty('serverPath')){
                        $.ajax({
                            dataType: "json",
                            type: 'delete',
                            url: '/delete-file',
                            data: {
                                file_path   : file.serverPath,
                                file_log_id : file.fileLogId
                            },
                            success: function(response){
                                that.model = response.model;
                                that.setup.triggerNextAction(that.model);
                            }
                        });
                    }
                });

                _.each(that.model.get('files'), function(file, key) {
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
                formData.append("modelName", that.setup.getModelName());
                formData.append("modelId", that.model.id);
            },
            maxfilesexceeded: function(file) {
                this.removeAllFiles();
                this.addFile(file);
            }
        });
    },
});
