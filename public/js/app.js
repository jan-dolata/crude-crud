$.ajaxSetup({headers:{"X-CSRF-TOKEN":$('meta[name="csrf-token"]').attr("content")}}),Crude={Models:{},Views:{},Collections:{},vent:_.extend({},Backbone.Events),trans:{},data:{}},app=new Backbone.Marionette.Application,app.addInitializer(function(e){Backbone.history.start()}),$(function(){app.start()}),Crude.getData=function(e,t){return _.isUndefined(t)&&(t=null),_.isUndefined(this.data[e])?t:this.data[e]},Crude.getTrans=function(e,t){return _.isUndefined(t)?_.isUndefined(this.trans[e])?e:this.trans[e]:_.isUndefined(this.trans[e][t])?String(e)+String(t):this.trans[e][t]},Crude.showAlert=function(e,t,i){_.isUndefined(i)&&(i=$("#crude_alertContainer")),Crude.showAlertInContainer(e,t,i)},Crude.showAlertInContainer=function(e,t,i){if(_.isUndefined(i)&&(i=$("#crude_alertContainer")),""!=String(t)){jQuery.inArray(e,["info","danger","warning","success"])||(e="info");var n=_.template($("#crude_alertTemplate").html());i.append(n({type:e,msg:t}))}},Crude.clearAllAlerts=function(e){_.isUndefined(e)&&(e=$("#crude_alertContainer")),e.empty()},Crude.showError=function(e,t){_.isUndefined(t)&&(t=$("#crude_alertContainer")),Crude.showAlertInContainer("danger",e,t)},Crude.showModal=function(e,t,i){""==e&&(e="&nbsp;");var n=_.template($("#crude_modalTemplate").html());$("#crude_modalContainer").html(n({title:e,content:t,btnList:i}));var a=$("#crude_modalContainer").find("#modalFade");a.find(".modal-footer");return a.modal("show"),a.on("shown.bs.modal",function(e){a.find(".btn:first").focus()}),a.on("hidden.bs.modal",function(e){a.off("hidden.bs.modal"),a.remove()}),a},Crude.getFormValues=function(e){var t={};return e.each(function(){var e=$(this);"custom"==e.attr("type")?t[e.data("attr")]=window[e.data("method")](e):"checkbox"==e.attr("type")?t[e.data("attr")]=e.is(":checked"):"select"==e.attr("type")?t[e.data("attr")]=e.find(":selected").val():"json"==e.attr("type")?t[e.data("attr")]=JSON.parse(e.val()):t[e.data("attr")]=e.val()}),t},Crude.getAttrName=function(e){return Crude.getTrans("validation.attributes",e)},Crude.renderInput=function(e,t,i){var n="#crude_textInputTemplate",a=e.get("inputType")[t],o=_.isUndefined(a)?n:"#crude_"+a+"InputTemplate",r=$(o);0==r.lenght&&(r=$(n));var s=_.template($(o).html());return s({setup:e,attr:t,model:i})},Crude.renderRichFilter=function(e,t,i){var n="#crude_textRichFilterTemplate",a=t.type,o=_.isUndefined(a)?n:"#crude_"+a+"RichFilterTemplate",r=$(o);0==r.lenght&&(r=$(n));var s=_.template($(o).html());return s({setup:e,richFilter:t,value:i})},Crude.renderCell=function(e,t,i){var n="#crude_textColumFormatTemplate",a=e.getColumnFormat(t),o="#crude_"+a.type+"ColumnFormatTemplate",r=$(o);0==r.lenght&&(r=$(n));var s=_.template($(o).html());return s({setup:e,format:a,attr:t,model:i})},Crude.Models.Base=Backbone.Model.extend({parse:function(e,t){return e.data&&e.data.model?e.data.model:e},getLatLngObject:function(){return{lat:parseFloat(this.get("lat")),lng:parseFloat(this.get("lng"))}},isCustomActionAvailable:function(e){return this.get(e+"CustomActionAvailable")}}),Crude.Collections.Base=Backbone.Collection.extend({sortAttributes:{attr:"id",order:"asc"},pagination:{page:1,numRows:20,numPages:1,count:0},search:{attr:"id",value:""},richFilters:{},changeSortOptions:function(e){return this.sortAttributes.attr==e?void(this.sortAttributes.order="asc"==this.sortAttributes.order?"desc":"asc"):(this.sortAttributes.attr=e,void(this.sortAttributes.order="asc"))},fetchWithOptions:function(){return this.fetch({data:{sortAttr:this.sortAttributes.attr,sortOrder:this.sortAttributes.order,page:this.pagination.page,numRows:this.pagination.numRows,searchAttr:this.search.attr,searchValue:this.search.value,richFilters:this.richFilters}})},parse:function(e,t){return e.data?(e.data.sortAttributes&&(this.sortAttributes=e.data.sort),e.data.pagination&&(this.pagination=e.data.pagination),e.data.search&&(this.search=e.data.search),e.data.richFilters&&(this.richFilters=e.data.richFilters),e.data.collection?e.data.collection:void 0):e}}),Crude.Models.Setup=Backbone.Model.extend({idAttribute:"name",defaults:{name:null,title:"",description:"",column:[],columnFormat:[],addForm:[],editForm:[],inputType:[],actions:[],deleteOption:!0,editOption:!0,addOption:!0,orderOption:!0,exportOption:!0,modelDefaults:[],selectOptions:[],customeActions:[],config:[],filters:[],richFilters:[],showFilters:!0,trans:[],moduleInPopup:!1,panelView:!1,checkboxColumn:!1,orderParameters:{idAttr:"id",orderAttr:"order",labelAttr:"name",sortAttr:"id"},actionToTrigger:[]},getName:function(){return this.get("name")},config:function(e){var t=this.get("config");return t[e]},baseRoute:function(e,t){return"/"+this.config("routePrefix")+"/"+e+"/"+t},apiRoute:function(){return this.baseRoute("api",this.getName())},autocompleteRoute:function(e){return this.baseRoute("autocomplete",e)},filesRoute:function(e){return this.baseRoute("file",e)},thumbnailRoute:function(e){return this.baseRoute("thumbnail",e)},customActionRoute:function(e,t){return this.baseRoute("custom-action",this.getName()+"/"+e+"/"+t)},orderedListRoute:function(){return this.baseRoute("ordered-list",this.getName())},containerId:function(){return"crudeSetup_"+this.getName()},getColumnFormat:function(e){var t=this.get("columnFormat");return e in t?t[e]:{type:"text"}},getNewCollection:function(){var e=this.apiRoute(),t=this.get("modelDefaults"),i=Crude.Models.Base.extend({urlRoot:e,defaults:t}),n=Crude.Collections.Base.extend({model:i,url:e,sortAttributes:{attr:this.get("defaultSortAttr"),order:this.get("defaultSortOrder")}}),a=new n;return a},getNewModel:function(){var e=this.apiRoute(),t=this.get("modelDefaults"),i=Crude.Models.Base.extend({urlRoot:e,defaults:t});return new i},isActionAvailable:function(e){return _.indexOf(this.get("actions"),e)!=-1},getNextAction:function(e){var t=_.indexOf(this.get("actions"),e)+1,i=this.get("actions")[t];return _.isUndefined(i)?"":i},triggerAction:function(e,t){_.isArray(e)||(e=[e]),$("html, body").animate({scrollTop:$("#"+this.containerId()).offset().top-200},500),this.set("actionToTrigger",e),Crude.vent.trigger("action_end",this.getName()),this.triggerNextAction(t)},triggerNextAction:function(e){Crude.vent.trigger("item_selected",this.getName());var t=this.get("actionToTrigger");if(0==t.length)return void this.triggerCancel();var i=t[0];t.shift(),Crude.vent.trigger("action_change",this.getName()),Crude.vent.trigger("action_"+i,this.getName(),e)},triggerCancel:function(){Crude.data.selectedItem=null,Crude.vent.trigger("action_end",this.getName()),Crude.vent.trigger("action_update",this.getName())},getAttrName:function(e){var t=this.get("trans");return e in t?t[e]:Crude.getAttrName(e)},onAjaxFail:function(e,t){if(!this.IsJsonString(e.responseText))return void Crude.showAlert("danger",e.responseText,t);var i=JSON.parse(e.responseText);if(422==e.status){var n=_.values(i).join("<br>");Crude.showError(n,t)}if(403==e.status){var n=i.error.message;Crude.showError(n,t),this.setup.triggerCancel()}},IsJsonString:function(e){try{JSON.parse(e)}catch(t){return!1}return!0}}),Crude.Views.Module=Backbone.Marionette.ItemView.extend({tagName:"div",moduleName:"",formIsLocked:!1,slideUpAllow:!0,ui:{save:"#save",cancel:"#cancel",input:".input",loader:"#loader"},events:{"click @ui.save":"save","click @ui.cancel":"cancel"},initialize:function(e){this.moduleInitialize(e)},moduleInitialize:function(e){this.setup=e.setup,this.model=this.setup.getNewModel(),this.slideUpAllow="slideUpAllow"in e?e.slideUpAllow:this.slideUpAllow,this.listenTo(Crude.vent,"action_"+this.moduleName,this.onAction),this.listenTo(Crude.vent,"action_end",this.onActionEnd),this.listenTo(Crude.vent,"action_change",this.onActionChange)},serializeData:function(){return{model:this.model.toJSON(),setup:this.setup}},onRender:function(){this.parentOnRender()},parentOnRender:function(){$('[data-toggle="tooltip"]').tooltip()},onActionEnd:function(e){this.setup.getName()==e&&this.slideUp()},onActionChange:function(e){this.setup.getName()==e&&this.changeUp()},onAction:function(e,t){this.setup.getName()==e&&this.setNewModel(t)},setNewModel:function(e){this.setup.get("moduleInPopup")?(this.$el.parent().show(),this.$el.parents("#moduleModal").modal("show")):this.$el.parent().slideDown(100,function(){Crude.vent.trigger("slide_down_finished",this.setup.getName())}.bind(this)),this.model=e,this.render()},alertContainer:function(){return $("#"+this.setup.containerId()).find("#alertContainer")},clearAllAlerts:function(){Crude.clearAllAlerts(this.alertContainer())},showError:function(e){Crude.showError(e,this.alertContainer())},showMessage:function(e){Crude.showAlert("success",e,this.alertContainer())},slideUp:function(){if(this.slideUpAllow)return this.clearAllAlerts(),this.setup.get("moduleInPopup")?(this.$el.parent().hide(),void this.$el.parents("#moduleModal").modal("hide")):void this.$el.parent().slideUp(100,function(){Crude.vent.trigger("slide_up_finished",this.setup.getName())}.bind(this))},changeUp:function(){this.$el.parent().hide()},cancel:function(){this.setup.triggerCancel()},saveModel:function(e){this.formIsLocked||(this.clearAllAlerts(),$(":focus").blur(),this.lockForm(),this.model.save().done(function(e){this.onSaveSuccess(e)}.bind(this)).fail(function(e){this.onSaveFail(e)}.bind(this)))},onSaveSuccess:function(e){this.unlockForm(),"data"in e&&"message"in e.data&&this.showMessage(e.data.message),this.setup.triggerNextAction(this.model)},onSaveFail:function(e){this.unlockForm(),this.setup.onAjaxFail(e,this.alertContainer())},lockForm:function(){this.formIsLocked=!0,this.ui.loader.show(200),this.ui.save.attr("disabled",!0),this.ui.cancel.attr("disabled",!0)},unlockForm:function(){this.formIsLocked=!1,this.ui.loader.hide(200),this.ui.save.removeAttr("disabled"),this.ui.cancel.removeAttr("disabled")}}),Crude.Views.FormModule=Crude.Views.Module.extend({template:"#crude_formTemplate",moduleName:"form",ui:{save:"#save",cancel:"#cancel",input:".input",loader:"#loader",autocomplete:".autocomplete",datetimepicker:".datetimepicker",showMarkdownPrieview:".showMarkdownPrieview",markdownInput:".markdownInput"},onRender:function(){this.parentOnRender(),this.bindAutocomplete(),this.bindDatepicker(),this.bindMarkdownPreview()},save:function(){var e=Crude.getFormValues(this.ui.input);this.model.set(e),this.saveModel()},bindAutocomplete:function(){var e=this.setup,t=this.model;this.ui.autocomplete.each(function(){var i=$(this),n=$(i.siblings(".autocompleteValue")[0]),a=e.getName(),o=i.data("attr");$.post(e.autocompleteRoute("label"),{crudeName:a,attr:o,value:t.get(o)},function(e){i.val(e)});var r=function(e,t){i.val(e),n.val(t),n.trigger("change")};i.autocomplete({source:e.autocompleteRoute("get/"+a+"/"+o),change:function(e,t){""==i.val()&&n.val(""),n.trigger("change")},response:function(e,t){Crude.data.autocomplete=t.content},close:function(e,t){var n=_.findWhere(Crude.data.autocomplete,{label:i.val()});return _.isUndefined(n)?r(i.val(),""):void r(n.label,n.id)}})}),this.ui.autocomplete.blur(function(e){var t=$(this),i=$(t.siblings(".autocompleteValue")[0]).val();_.isEmpty(i)&&t.val("")})},bindDatepicker:function(){this.ui.datetimepicker.datetimepicker(this.setup.get("dateTimePickerOptions"))},bindMarkdownPreview:function(){var e=window.markdownit(),t=function(t){var i=$(t).val();$(t).parents(".row").find(".markdownPreview").html(e.render(i))};this.ui.markdownInput.bind("keyup",function(){t(this)}),this.ui.markdownInput.bind("click",function(){t(this)})}}),Crude.Views.FileModule=Crude.Views.Module.extend({template:"#crude_fileTemplate",moduleName:"file",dropzone:"",uploadSuccessfull:!0,errorMesssages:[],maxFiles:10,parallelUploads:10,cleaningUp:!1,ui:{save:"#save",cancel:"#cancel",loader:"#loader",uploadFileDropzone:"#upload_file_dropzone"},save:function(){},initialize:function(e){this.moduleInitialize(e),this.maxFiles=e.hasOwnProperty("maxFiles")?e.maxFiles:this.maxFiles,this.parallelUploads=e.hasOwnProperty("parallelUploads")?e.parallelUploads:this.parallelUploads},onRender:function(){this.parentOnRender(),this.ui.save.hide(100);var e=this;this.ui.uploadFileDropzone.dropzone({headers:{"X-CSRF-Token":$('meta[name="csrf-token"]').attr("content")},url:e.setup.filesRoute("upload"),previewTemplate:$("#crude_dropzoneTemplate").html(),maxFiles:e.maxFiles,parallelUploads:e.parallelUploads,uploadMultiple:!0,autoProcessQueue:!0,init:function(){e.dropzone=this,this.on("success",function(e,t){if(t.success&&"model"in t&&"files"in t.model){var i=_.findKey(t.model.files,{file_original_name:e.name});e.fileLogId=t.model.files[i].file_log_id}}),this.on("successmultiple",function(n,a){a.hasOwnProperty("errors")&&(e.uploadSuccessfull=!1,Crude.showError(a.errors,e.alertContainer())),t(a.model.files),i(),Crude.vent.trigger("action_update",e.setup.getName())}),this.on("removedfile",function(i){i.hasOwnProperty("fileLogId")&&!e.cleaningUp&&$.ajax({dataType:"json",type:"delete",url:e.setup.filesRoute("delete"),data:{file_path:i.serverPath,file_log_id:i.fileLogId,crudeName:e.setup.getName()},success:function(i){t(i.model.files),Crude.vent.trigger("action_update",e.setup.getName())}})});var t=function(t){e.model.set(e.setup.get("fileAttrName"),t)},i=function(){e.cleaningUp=!0,e.dropzone.removeAllFiles(),e.cleaningUp=!1;var t=e.model.get(e.setup.get("fileAttrName"));_.each(t,function(i,n){var a={name:i.file_original_name,thumb:i.path,serverPath:i.path,fileLogId:i.file_log_id};e.dropzone.emit("addedfile",a),e.dropzone.createThumbnailFromUrl(a,a.serverPath),e.dropzone.files.push(a),e.dropzone.options.maxFiles=e.maxFiles-t.length})};i()},sending:function(t,i,n){n.append("crudeName",e.setup.getName()),n.append("modelId",e.model.id)},dictMaxFilesExceeded:e.setup.get("dropzoneTrans").dictMaxFilesExceeded})}}),Crude.Views.MapModule=Crude.Views.Module.extend({template:"#crude_mapTemplate",moduleName:"map",map:null,geocoder:null,selectedLocation:null,ui:{save:"#save",cancel:"#cancel",input:".input",loader:"#loader",mapContainer:"#mapContainer",info:"#info",position:"#position",search:"#search"},initialize:function(e){this.moduleInitialize(e),this.listenTo(Crude.vent,"slide_down_finished",this.refreshMap)},onRender:function(){this.parentOnRender(),this.whenAvailable("google",function(){this.initMap()}.bind(this))},whenAvailable:function(e,t){var i=10,n=this;window[e]?t():window.setTimeout(function(){window[e]?t():window.setTimeout(n.whenAvailable(e,t),i)},i)},save:function(){this.saveModel()},initMap:function(){this.map=new google.maps.Map(this.ui.mapContainer[0],{center:this.model.getLatLngObject(),zoom:6});var e=new google.maps.Marker({map:this.map,position:this.model.getLatLngObject()});this.showSelectedLocation(),this.map.addListener("click",function(t){this.model.set("lat",t.latLng.lat()),this.model.set("lng",t.latLng.lng()),this.showSelectedLocation(),e.setPosition(this.model.getLatLngObject())}.bind(this)),this.bindSearch()},refreshMap:function(e){e==this.setup.getName()&&(google.maps.event.trigger(this.map,"resize"),this.map.setCenter(this.model.getLatLngObject()))},showSelectedLocation:function(){this.ui.position.html(this.model.get("lat")+" x "+this.model.get("lng"));var e=new google.maps.Geocoder;e.geocode({location:this.model.getLatLngObject()},function(e,t){this.ui.info.html(""),t===google.maps.GeocoderStatus.OK&&(this.ui.info.html(e[0].formatted_address),this.model.set("address",e[0].formatted_address))}.bind(this))},bindSearch:function(){var e=this.ui.search[0],t=this.map,i=new google.maps.places.SearchBox(e);t.controls[google.maps.ControlPosition.TOP_LEFT].push(e),t.addListener("bounds_changed",function(){i.setBounds(t.getBounds())}.bind(this));var n=[];i.addListener("places_changed",function(){var e=i.getPlaces();if(0!=e.length){n.forEach(function(e){e.setMap(null)}),n=[];var a=new google.maps.LatLngBounds;e.forEach(function(e){var i={url:e.icon,size:new google.maps.Size(71,71),origin:new google.maps.Point(0,0),anchor:new google.maps.Point(17,34),scaledSize:new google.maps.Size(25,25)};n.push(new google.maps.Marker({map:t,icon:i,title:e.name,position:e.geometry.location})),e.geometry.viewport?a.union(e.geometry.viewport):a.extend(e.geometry.location)}),t.fitBounds(a)}})}}),Crude.Views.ThumbnailModule=Crude.Views.Module.extend({template:"#crude_thumbnailTemplate",moduleName:"thumbnail",dropzone:"",uploadSuccessfull:!0,errorMesssages:[],ui:{save:"#save",cancel:"#cancel",loader:"#loader"},save:function(){},onRender:function(){var e=this;_.each(this.setup.get("thumbnailColumns"),function(t){this.$("#upload_file_dropzone_"+t).dropzone(e.dropzoneSetup(t))}),this.parentOnRender(),this.ui.save.hide(100)},dropzoneSetup:function(e){var t=this;return{headers:{"X-CSRF-Token":$('meta[name="csrf-token"]').attr("content")},url:t.setup.thumbnailRoute("upload"),previewTemplate:$("#crude_dropzoneThumbnailTemplate").html(),maxFiles:1,uploadMultiple:!1,autoProcessQueue:!0,init:function(){t.dropzone=this,this.on("success",function(i,n){return n.success&&(i.serverPath=n.model[e].original_path),n.success?void Crude.vent.trigger("action_update",t.setup.getName()):(t.uploadSuccessfull=!1,void(t.errorMessages=n.errors.file))}),this.on("queuecomplete",function(){return t.uploadSuccessfull?void Crude.vent.trigger("action_update",t.setup.getName()):(_.each(t.errorMessages,function(e){t.dropzone.removeAllFiles(),Crude.showError(e,t.alertContainer())}),void(t.errorMessages=[]))}),this.on("removedfile",function(i){i.hasOwnProperty("serverPath")&&$.ajax({dataType:"json",type:"delete",url:t.setup.thumbnailRoute("delete"),data:{model_id:t.model.id,model_column:e,file_path:i.serverPath,crudeName:t.setup.getName()},success:function(e){t.model=e.model,Crude.vent.trigger("action_update",t.setup.getName())}})});var i=t.model.get(e);if(i){var n={name:i.file_original_name,thumb:i.original_path,serverPath:i.original_path,accepted:!0};t.dropzone.emit("addedfile",n),t.dropzone.createThumbnailFromUrl(n,n.serverPath),t.dropzone.files.push(n)}},sending:function(i,n,a){a.append("crudeName",t.setup.getName()),a.append("modelId",t.model.id),a.append("columnName",e)},maxfilesexceeded:function(e){this.removeAllFiles(),this.addFile(e)}}}}),Crude.Views.ListItem=Backbone.Marionette.ItemView.extend({template:"#crude_listItemTemplate",tagName:"tr",className:function(){var e="crude-table-body-row ";return e+=Crude.data.selectedItem==this.model.get("id")?"active":""},ui:{action:".action",customAction:".customAction","delete":"#delete"},events:{"click @ui.action":"action","click @ui.delete":"delete","click @ui.customAction":"customAction"},initialize:function(e){this.setup=e.setup,this.listenTo(Crude.vent,"item_selected",this.itemSelected)},onRender:function(){$('[data-toggle="tooltip"]').tooltip()},serializeData:function(){return{model:this.model,setup:this.setup}},action:function(e){$(":focus").blur(),Crude.data.selectedItem=this.model.get("id");var t=$(e.target);t.hasClass("action")||(t=t.parents(".action"));var i=t.data("action");this.setup.triggerAction(i,this.model)},customAction:function(e){$(":focus").blur();var t=$(e.target);t.hasClass("customAction")||(t=t.parents(".customAction"));var i=$("#"+this.setup.containerId()).find("#alertContainer"),n=t.data("action"),a=this.model.get("id"),o=this;$.ajax({url:o.setup.customActionRoute(n,a),type:"get",success:function(e){Crude.showAlert("success",e.data.message,i),Crude.vent.trigger("action_update",o.setup.getName())},error:function(e){o.setup.onAjaxFail(e,i)}})},itemSelected:function(e){this.setup.getName()==e&&(this.model.get("id")==Crude.data.selectedItem?this.$el.addClass("active"):this.$el.removeClass("active"))},"delete":function(){$(":focus").blur(),this.setup.triggerCancel();var e=$("#deleteItemConfirmModal");e.modal("show");var t=$("#"+this.setup.containerId()).find("#alertContainer");e.find("#confirm").click(function(i){this.model.destroy({wait:!0}).done(function(i){Crude.vent.trigger("action_update",this.setup.getName()),"message"in i&&Crude.showAlert("success",i.data.message,t),e.modal("hide")}.bind(this)).fail(function(i){var n=JSON.parse(i.responseText);422==i.status&&(errors=_.values(n).join("<br>"),Crude.showAlert("danger",errors,t)),403==i.status&&Crude.showAlert("danger",n.error.message,t),e.modal("hide"),this.setup.triggerCancel()}.bind(this))}.bind(this))}}),Crude.Views.ListEmpty=Backbone.Marionette.ItemView.extend({template:"#crude_listEmptyTemplate",tagName:"tr",className:"crude-table-body-row",initialize:function(e){this.setup=e.setup},serializeData:function(){return{setup:this.setup}}}),Crude.Views.List=Backbone.Marionette.CompositeView.extend({template:"#crude_listTemplate",childView:Crude.Views.ListItem,emptyView:Crude.Views.ListEmpty,childViewContainer:"#childViewContainer",tagName:"table",className:"table table-hover crude-table",updateTime:"",ui:{updateDelay:"#updateDelay",refresh:"#refresh",add:"#add",order:"#order",sort:".sort",check:"#check",changeNumRows:".changeNumRows",changePage:".changePage",changeSearchAttr:".changeSearchAttr",searchValue:"#searchValue",search:"#search",selectedSearchAttr:"#selectedSearchAttr",clearSearch:"#clearSearch",clearRichFilter:".clearRichFilter",useRichFilters:"#useRichFilters",richFilterValue:".richFilterValue"},events:{"click @ui.add":"add","click @ui.order":"order","click @ui.sort":"sort","click @ui.check":"check","click @ui.changeNumRows":"changeNumRows","click @ui.changePage":"changePage","click @ui.changeSearchAttr":"changeSearchAttr","click @ui.search":"search","keyup @ui.searchValue":"searchOnEnter","click @ui.clearSearch":"clearSearch","click @ui.refresh":"updateList","click @ui.clearRichFilter":"clearRichFilter","click @ui.useRichFilters":"updateList","change @ui.richFilterValue":"richFilterValue"},initialize:function(e){this.setup=e.setup,this.updateTime=Date.now(),this.collection=this.setup.getNewCollection(),this.updateList(),this.listenTo(Crude.vent,"action_update",this.updateThisList),this.listenTo(Crude.vent,"open_add_form",this.add)},childViewOptions:function(){return{setup:this.setup}},serializeData:function(){return{setup:this.setup,sort:this.collection.sortAttributes,pagination:this.collection.pagination,search:this.collection.search,richFilters:this.collection.richFilters}},onRender:function(){$('[data-toggle="tooltip"]').tooltip(),this.bindDatepickerInRichFilters(),setInterval(function(){var e=Date.now()-this.updateTime;e=parseInt(e/1e3);var t=e%60,i=parseInt(e/60);t=String("00"+t).slice(-2),this.ui.updateDelay.html(i+":"+t)}.bind(this),1e3)},add:function(){$(":focus").blur(),Crude.data.selectedItem=null,this.setup.triggerAction(_.clone(this.setup.get("actions")),this.setup.getNewModel())},sort:function(e){var t=$(e.target);t.hasClass("sort")||(t=t.parents(".sort")),this.collection.changeSortOptions(t.data("attr")),this.updateList()},check:function(){var e=$(".checkboxColumn"+this.setup.getName()),t=$(".checkboxColumn"+this.setup.getName()+":checked"),i=e.length>t.length;e.each(function(){$(this).prop("checked",i)})},order:function(){$(":focus").blur(),this.setup.triggerCancel();var e=$("#"+this.setup.containerId()).find("#alertContainer"),t=this.collection.toJSON(),i=this.setup.get("orderParameters");t=_.sortBy(t,function(e){return parseInt(e[i.orderAttr])});var n=_.template($("#crude_orderedListModalTemplate").html())({list:t,options:i});$modal=$("#orderedListModal"),$modal.find("#content").html(n),$modal.modal("show"),$modal.find("#collection").sortable();var a=_.pluck(t,i.orderAttr);a=_.sortBy(a,function(e){return parseInt(e)});var o=this.setup.orderedListRoute(),r=this;$modal.find("#confirm").click(function(){var t=[],i=0;$modal.find("#collection").find("li").each(function(){t.push({id:$(this).data("id"),order:a[i]}),i++}),$.ajax({url:o,type:"post",data:{orderList:t},success:function(t){$modal.modal("hide"),Crude.vent.trigger("action_update",r.setup.getName()),Crude.showAlert("success",t.data.message,e)},error:function(t){$modal.modal("hide"),r.setup.onAjaxFail(t,e)}})})},changeNumRows:function(e){var t=$(e.target);this.collection.pagination.numRows=t.html(),this.updateList()},changePage:function(e){var t=$(e.target);this.collection.pagination.page=t.html(),this.updateList()},changeSearchAttr:function(e){var t=$(e.target);this.collection.search.attr=t.data("attr"),this.ui.selectedSearchAttr.html(t.html())},searchOnEnter:function(e){13==e.keyCode&&this.search()},search:function(){this.collection.search.value=this.ui.searchValue.val(),this.updateList()},clearSearch:function(){this.collection.search.attr="id",this.collection.search.value="",this.updateList()},updateList:function(){this.collection.fetchWithOptions().done(function(e){Crude.vent.trigger("fetched_completed"),this.updateTime=Date.now(),this.render()}.bind(this))},updateThisList:function(e){(this.setup.getName()==e||this.setup.config("refreshAll"))&&this.updateList()},clearRichFilter:function(e){var t=$(e.target);t.hasClass("clearRichFilter")||(t=t.parent());var i=t.data("name"),n=$('.richFilterValue[data-name="'+i+'"]');_.isEmpty(n.val())||(n.val(""),delete this.collection.richFilters[i],this.updateList())},richFilterValue:function(e){var t=$(e.target),i=t.data("name"),n=this.setup.get("richFilters")[i];"select"==n.type?this.collection.richFilters[t.data("name")]=t.find(":selected").val():this.collection.richFilters[t.data("name")]=t.val(),this.updateList()},bindDatepickerInRichFilters:function(){var e=this.setup.get("dateTimePickerOptions"),t=this.setup.get("richFilters");for(var n in t)if("datetime"==t[n].type){var a=_.isEmpty(t[n].options)?e:t[i].options;$('.richFilterValue[data-name="'+n+'"').parent().datetimepicker(a)}}}),Crude.Views.Layout=Backbone.Marionette.LayoutView.extend({template:"#crude_layoutTemplate",tagName:"div",className:"",firstRender:!0,title:"",regions:{list:"#listRegion",form:"#formRegion",map:"#mapRegion",file:"#fileRegion",thumbnail:"#thumbnailRegion"},initialize:function(e){this.setup=e.setup},serializeData:function(){return{setup:this.setup}},onRender:function(){if(this.firstRender){var e=this.setup;this.list.show(new Crude.Views.List({setup:e})),this.setup.isActionAvailable("form")&&this.form.show(new Crude.Views.FormModule({setup:e})),this.setup.isActionAvailable("file")&&this.file.show(new Crude.Views.FileModule({setup:e})),this.setup.isActionAvailable("map")&&this.map.show(new Crude.Views.MapModule({setup:e})),this.setup.isActionAvailable("thumbnail")&&this.thumbnail.show(new Crude.Views.ThumbnailModule({setup:e})),this.firstRender=!1}$('[data-toggle="tooltip"]').tooltip()}}),$(function(){var e=Crude.getData("crudeSetup",[]),t=$("#crudeContainer");_.each(e,function(e){var e=new Crude.Models.Setup(e),i=e.get("panelView")?" crude-box-panel":"";t.append('<div id="'+e.containerId()+'" class="container crude-box'+i+'"></div>');var n=new Crude.Views.Layout({el:"#"+e.containerId(),setup:e});n.render()}),$('[data-toggle="tooltip"]').tooltip(),$("#deleteItemConfirmModal").find(".modal-content").html(_.template($("#crude_deleteItemConfirmModalTemplate").html())({}))});