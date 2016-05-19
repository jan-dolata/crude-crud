Crude.Views.FileModule = Crude.Views.Module.extend(
{
    template: '#crude_fileTemplate',
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
            url: that.setup.filesRoute('upload'),
            previewTemplate: $('#crude_dropzoneTemplate').html(),
            maxFiles: 10,
            parallelUploads: 10,
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
                            url: that.setup.filesRoute('delete'),
                            data: {
                                file_path   : file.serverPath,
                                file_log_id : file.fileLogId,
                                crudeName   : that.setup.getName()
                            },
                            success: function(response){
                                that.model = response.model;
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
