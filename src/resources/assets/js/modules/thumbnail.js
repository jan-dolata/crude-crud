Crude.Views.ThumbnailModule = Crude.Views.Module.extend(
{
    template: '#crude_thumbnailTemplate',
    moduleName: 'thumbnail',

    dropzone: '',
    uploadSuccessfull: true,
    errorMesssages: [],

    ui: {
        save: '#save',
        cancel: '#cancel',
        loader: '#loader',
    },

    save: function() { },

    onRender: function()
    {
        var that = this;
        _.each(this.setup.get('thumbnailColumns'), function(column) {
            this.$('#upload_file_dropzone_'+column).dropzone(that.dropzoneSetup(column));
        });

        this.parentOnRender();

        this.ui.save.hide(100);
    },

    dropzoneSetup: function(column)
    {
        var that = this;
        return {
            headers: {
                'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
            },
            url: that.setup.thumbnailRoute('upload'),
            previewTemplate: $('#crude_dropzoneThumbnailTemplate').html(),
            maxFiles: 1,
            uploadMultiple: false,
            autoProcessQueue: true,
            init: function()
            {
                that.dropzone = this;

                this.on("success", function(file, response)
                {
                    if (response.success) {
                        file.serverPath = response.model[column].original_path;
                    }

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
                            Crude.showError(error);
                        });

                        that.errorMessages = [];
                        return;
                    }

                    Crude.vent.trigger('action_update', that.setup.getName());
                });

                this.on("removedfile", function(file) {
                    if (file.hasOwnProperty('serverPath')){
                        $.ajax({
                            dataType: "json",
                            type: 'delete',
                            url: that.setup.thumbnailRoute('delete'),
                            data: {
                                model_id    : that.model.id,
                                model_column : column,
                                file_path   : file.serverPath,
                                crudeName   : that.setup.getName()
                            },
                            success: function(response){
                                that.model = response.model;

                                Crude.vent.trigger('action_update', that.setup.getName());
                            }
                        });
                    }
                });

                var file = that.model.get(column);
                if (file) {
                    var dzFile = {
                        name: file.file_original_name,
                        thumb: file.original_path,
                        serverPath: file.original_path,
                        accepted: true
                    };
                    that.dropzone.emit("addedfile", dzFile);
                    that.dropzone.createThumbnailFromUrl(dzFile, dzFile.serverPath);

                    that.dropzone.files.push(dzFile);

                    // var existingFileCount = 1; // The number of files already uploaded
                    // that.dropzone.options.maxFiles = that.dropzone.options.maxFiles - existingFileCount;
                }

            },
            sending: function(file, xhr, formData) {
                formData.append("crudeName", that.setup.getName());
                formData.append("modelId", that.model.id);
                formData.append("columnName", column);
            },
            maxfilesexceeded: function(file) {
                this.removeAllFiles();
                this.addFile(file);
            }
        }
    }
});
