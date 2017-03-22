$.ajaxSetup({headers:{"X-CSRF-TOKEN":$('meta[name="csrf-token"]').attr("content")}}),Crude={Models:{},Views:{},Collections:{},vent:_.extend({},Backbone.Events),trans:{},data:{}},app=new Backbone.Marionette.Application,app.addInitializer(function(e){Backbone.history.start()}),$(function(){app.start()}),Crude.getData=function(e,t){return _.isUndefined(t)&&(t=null),_.isUndefined(this.data[e])?t:this.data[e]},Crude.getTrans=function(e,t){return _.isUndefined(t)?_.isUndefined(this.trans[e])?e:this.trans[e]:_.isUndefined(this.trans[e][t])?String(e)+String(t):this.trans[e][t]},Crude.showAlert=function(e,t,i){_.isUndefined(i)&&(i=$("#crude_alertContainer")),Crude.showAlertInContainer(e,t,i)},Crude.showAlertInContainer=function(e,t,i){if(_.isUndefined(i)&&(i=$("#crude_alertContainer")),""!=String(t)){jQuery.inArray(e,["info","danger","warning","success"])||(e="info");var n=_.template($("#crude_alertTemplate").html());i.append(n({type:e,msg:t}))}},Crude.clearAllAlerts=function(e){_.isUndefined(e)&&(e=$("#crude_alertContainer")),e.empty()},Crude.showError=function(e,t){_.isUndefined(t)&&(t=$("#crude_alertContainer")),Crude.showAlertInContainer("danger",e,t)},Crude.showModal=function(e,t,i){""==e&&(e="&nbsp;");var n=_.template($("#crude_modalTemplate").html());$("#crude_modalContainer").html(n({title:e,content:t,btnList:i}));var s=$("#crude_modalContainer").find("#modalFade");s.find(".modal-footer");return s.modal("show"),s.on("shown.bs.modal",function(e){s.find(".btn:first").focus()}),s.on("hidden.bs.modal",function(e){s.off("hidden.bs.modal"),s.remove()}),s},Crude.getFormValues=function(e){var t={};return e.each(function(){var e=$(this);"custom"==e.attr("type")?t[e.data("attr")]=window[e.data("method")](e):"checkbox"==e.attr("type")?t[e.data("attr")]=e.is(":checked"):"select"==e.attr("type")||"selectize"==e.attr("type")?t[e.data("attr")]=e.find(":selected").val():"json"==e.attr("type")?t[e.data("attr")]=JSON.parse(e.val()):t[e.data("attr")]=e.val()}),t},Crude.getAttrName=function(e){return Crude.getTrans("validation.attributes",e)},Crude.renderInput=function(e,t,i){var n="#crude_textInputTemplate",s=e.getInputType(t),a=_.isUndefined(s)?n:"#crude_"+s+"InputTemplate",o=$(a);0==o.lenght&&(o=$(n));var r=_.template($(a).html());return r({setup:e,attr:t,model:i})},Crude.renderRichFilter=function(e,t,i){var n="#crude_textRichFilterTemplate",s=t.type,a=_.isUndefined(s)?n:"#crude_"+s+"RichFilterTemplate",o=$(a);0==o.lenght&&(o=$(n));var r=_.template($(a).html());return r({setup:e,richFilter:t,value:i})},Crude.renderCell=function(e,t,i){var n="#crude_textColumFormatTemplate",s=e.getColumnFormat(t),a="#crude_"+s.type+"ColumnFormatTemplate",o=$(a);0==o.lenght&&(o=$(n));var r=_.template($(a).html());return r({setup:e,format:s,attr:t,model:i})},Crude.whenAvailable=function(e,t){var i=10;window[e]?t():window.setTimeout(function(){window[e]?t():window.setTimeout(Crude.whenAvailable(e,t),i)},i)},Crude.isUrl=function(e){var t=new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?");return t.test(e)},Crude.isEmail=function(e){var t=new RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);return t.test(e)},Crude.nl2br=function(e,t){var i=t||"undefined"==typeof t?"<br />":"<br>";return(e+"").replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g,"$1"+i+"$2")},Crude.Models.Base=Backbone.Model.extend({parse:function(e,t){return e.data&&e.data.model?e.data.model:e},getLatLngObject:function(){return{lat:parseFloat(this.get("map_lat")),lng:parseFloat(this.get("map_lng"))}},hasLatLngObject:function(){return!_.isNaN(this.getLatLngObject().lat)&&!_.isNaN(this.getLatLngObject().lng)},isCustomActionAvailable:function(e){return this.get(e+"CustomActionAvailable")}}),Crude.Collections.Base=Backbone.Collection.extend({sortAttributes:{attr:"id",order:"asc"},pagination:{page:1,numRows:20,numPages:1,count:0},search:{attr:"id",value:""},richFilters:{},changeSortOptions:function(e){return this.sortAttributes.attr==e?void(this.sortAttributes.order="asc"==this.sortAttributes.order?"desc":"asc"):(this.sortAttributes.attr=e,void(this.sortAttributes.order="asc"))},fetchWithOptions:function(){return this.fetch({data:{sortAttr:this.sortAttributes.attr,sortOrder:this.sortAttributes.order,page:this.pagination.page,numRows:this.pagination.numRows,searchAttr:this.search.attr,searchValue:this.search.value,richFilters:this.richFilters}})},parse:function(e,t){return e.data?(e.data.sortAttributes&&(this.sortAttributes=e.data.sort),e.data.pagination&&(this.pagination=e.data.pagination),e.data.search&&(this.search=e.data.search),e.data.richFilters&&(this.richFilters=e.data.richFilters),e.data.collection?e.data.collection:void 0):e}}),Crude.Models.Setup=Backbone.Model.extend({idAttribute:"name",defaults:{name:null,title:"",description:"",column:[],extraColumn:{},columnFormat:[],addForm:[],editForm:[],inputType:[],actions:[],deleteOption:!0,editOption:!0,addOption:!0,orderOption:!0,exportOption:!0,modelDefaults:[],selectOptions:[],customeActions:[],config:[],filters:[],richFilters:[],showFilters:!0,trans:[],moduleInPopup:!1,panelView:!1,checkboxColumn:!1,orderParameters:{idAttr:"id",orderAttr:"order",labelAttr:"name",sortAttr:"id"},actionToTrigger:[],interfaceTrans:{}},getName:function(){return this.get("name")},config:function(e){var t=this.get("config");return t[e]},interfaceTrans:function(e,t){return _.isUndefined(t)?this.get("interfaceTrans")[e]:this.get("interfaceTrans")[e][t]},baseRoute:function(e,t){return"/"+this.config("routePrefix")+"/"+e+"/"+t},apiRoute:function(){return this.baseRoute("api",this.getName())},autocompleteRoute:function(e){return this.baseRoute("autocomplete",e)},filesRoute:function(e){return this.baseRoute("file",e)},thumbnailRoute:function(e){return this.baseRoute("thumbnail",e)},customActionRoute:function(e,t){return this.baseRoute("custom-action",this.getName()+"/"+e+"/"+t)},orderedListRoute:function(){return this.baseRoute("ordered-list",this.getName())},containerId:function(){return"crudeSetup_"+this.getName()},formContainerId:function(){return"crudeForm_"+this.getName()},mapContainerId:function(){return"crudeMap_"+this.getName()},getVisibleColumns:function(){var e=this.get("column"),t=this.get("extraColumn");if(_.isEmpty(t))return e;var i=[];for(var n in e){var s=e[n];if(_.isArray(s)){var a=[];for(var o in s){var r=s[o];r in t&&!t[r].visible||a.push(r)}a.length&&i.push(a)}else s in t&&!t[s].visible||i.push(s)}return i},getColumnFormat:function(e){var t=this.get("columnFormat");return e in t?t[e]:{type:"default"}},getNewCollection:function(){var e=this.apiRoute(),t=this.get("modelDefaults"),i=Crude.Models.Base.extend({urlRoot:e,defaults:t}),n=Crude.Collections.Base.extend({model:i,url:e,sortAttributes:{attr:this.get("defaultSortAttr"),order:this.get("defaultSortOrder")}}),s=new n;return s},getNewModel:function(){var e=this.apiRoute(),t=this.get("modelDefaults"),i=Crude.Models.Base.extend({urlRoot:e,defaults:t});return new i},isActionAvailable:function(e){return _.indexOf(this.get("actions"),e)!=-1},getNextAction:function(e){var t=_.indexOf(this.get("actions"),e)+1,i=this.get("actions")[t];return _.isUndefined(i)?"":i},triggerAction:function(e,t,i){_.isArray(e)||(e=[e]),$("html, body").animate({scrollTop:$(i).offset().top-200},500),this.set("actionToTrigger",e),Crude.vent.trigger("action_end",this.getName()),this.triggerNextAction(t)},triggerNextAction:function(e){Crude.vent.trigger("item_selected",this.getName());var t=this.get("actionToTrigger");if(0==t.length)return void this.triggerCancel();var i=t[0];t.shift(),Crude.vent.trigger("action_change",this.getName()),Crude.vent.trigger("action_"+i,this.getName(),e)},triggerCancel:function(){Crude.data.selectedItem=null,Crude.vent.trigger("action_end",this.getName()),Crude.vent.trigger("action_update",this.getName())},getAttrName:function(e){var t=this.get("trans");return e in t?t[e]:Crude.getAttrName(e)},onAjaxFail:function(e,t){if(!this.IsJsonString(e.responseText))return void Crude.showAlert("danger",e.responseText,t);var i=JSON.parse(e.responseText);if(422==e.status){var n=_.values(i).join("<br>");Crude.showError(n,t)}if(403==e.status){var n=i.error.message;Crude.showError(n,t),this.setup.triggerCancel()}},IsJsonString:function(e){try{JSON.parse(e)}catch(t){return!1}return!0},getInputType:function(e){return this.get("inputType")[e]}}),Crude.Views.Module=Backbone.Marionette.ItemView.extend({tagName:"div",moduleName:"",formIsLocked:!1,slideUpAllow:!0,unlockCancel:!1,ui:{save:"#save",cancel:"#cancel",clear:"#clear",input:".input",loader:"#loader"},events:{"click @ui.save":"save","click @ui.cancel":"cancel","click @ui.clear":"clear"},initialize:function(e){this.moduleInitialize(e)},moduleInitialize:function(e){this.setup=e.setup,this.model="model"in e?e.model:this.setup.getNewModel(),this.slideUpAllow="slideUpAllow"in e?e.slideUpAllow:this.slideUpAllow,this.unlockCancel="unlockCancel"in e?e.unlockCancel:this.unlockCancel,this.listenTo(Crude.vent,"action_"+this.moduleName,this.onAction),this.listenTo(Crude.vent,"action_end",this.onActionEnd),this.listenTo(Crude.vent,"action_change",this.onActionChange),this.listenTo(Crude.vent,"save_this_model",this.saveThisModel)},serializeData:function(){return{model:this.model.toJSON(),setup:this.setup}},onRender:function(){this.parentOnRender()},parentOnRender:function(){$('[data-toggle="tooltip"]').tooltip(),this.unlockCancel&&this.$("#cancel").hide()},onActionEnd:function(e){this.setup.getName()==e&&this.slideUp()},onActionChange:function(e){this.setup.getName()==e&&this.changeUp()},onAction:function(e,t){this.setup.getName()==e&&this.setNewModel(t)},setNewModel:function(e){this.setup.get("moduleInPopup")?(this.$el.parent().show(),this.$el.parents("#moduleModal").modal("show")):this.$el.parent().slideDown(100,function(){Crude.vent.trigger("slide_down_finished",this.setup.getName())}.bind(this)),this.model=e,this.render()},alertContainer:function(){return this.$el.parents(".crude-header").find("#alertContainer")},clearAllAlerts:function(){Crude.clearAllAlerts(this.alertContainer())},showError:function(e){Crude.showError(e,this.alertContainer())},showMessage:function(e){Crude.showAlert("success",e,this.alertContainer())},slideUp:function(){if(this.slideUpAllow)return this.clearAllAlerts(),this.setup.get("moduleInPopup")?(this.$el.parent().hide(),void this.$el.parents("#moduleModal").modal("hide")):void this.$el.parent().slideUp(100,function(){Crude.vent.trigger("slide_up_finished",this.setup.getName())}.bind(this))},changeUp:function(){this.$el.parent().hide()},cancel:function(){this.setup.triggerCancel()},saveModel:function(e){this.formIsLocked||(this.clearAllAlerts(),$(":focus").blur(),this.lockForm(),this.model.save().done(function(e){this.onSaveSuccess(e)}.bind(this)).fail(function(e){this.onSaveFail(e)}.bind(this)))},onSaveSuccess:function(e){this.unlockForm(),"data"in e&&"message"in e.data&&this.showMessage(e.data.message),"data"in e&&"model"in e.data&&this.model.set(e.data.model),this.setup.triggerNextAction(this.model)},onSaveFail:function(e){this.unlockForm(),this.setup.onAjaxFail(e,this.alertContainer())},lockForm:function(){this.formIsLocked=!0,this.ui.loader.show(200),this.ui.save.attr("disabled",!0),this.ui.cancel.attr("disabled",!0)},unlockForm:function(){this.formIsLocked=!1,this.ui.loader.hide(200),this.ui.save.removeAttr("disabled"),this.ui.cancel.removeAttr("disabled")},saveThisModel:function(e){this.setup.getName()==e&&this.save()}}),Crude.Views.FormModule=Crude.Views.Module.extend({template:"#crude_formModuleTemplate",moduleName:"form",ui:{save:"#save",cancel:"#cancel",input:".input",loader:"#loader",autocomplete:".autocomplete",datetimepicker:".datetimepicker",showMarkdownPrieview:".showMarkdownPrieview",markdownInput:".markdownInput"},onRender:function(){this.parentOnRender(),this.bindAutocomplete(),this.bindDatepicker(),this.bindMarkdownPreview(),this.bindSelectize()},save:function(){var e=Crude.getFormValues(this.ui.input);this.model.set(e),this.saveModel()},bindAutocomplete:function(){var e=this.setup,t=this.model;this.ui.autocomplete.each(function(){var i=$(this),n=$(i.siblings(".autocompleteValue")[0]),s=e.getName(),a=i.data("attr");$.post(e.autocompleteRoute("label"),{crudeName:s,attr:a,value:t.get(a)},function(e){i.val(e)});var o=function(e,t){i.val(e),n.val(t),n.trigger("change")};i.autocomplete({source:e.autocompleteRoute("get/"+s+"/"+a),change:function(e,t){""==i.val()&&n.val(""),n.trigger("change")},response:function(e,t){Crude.data.autocomplete=t.content},close:function(e,t){var n=_.findWhere(Crude.data.autocomplete,{label:i.val()});return _.isUndefined(n)?o(i.val(),""):void o(n.label,n.id)}})}),this.ui.autocomplete.blur(function(e){var t=$(this),i=$(t.siblings(".autocompleteValue")[0]).val();_.isEmpty(i)&&t.val("")})},bindDatepicker:function(){this.ui.datetimepicker.datetimepicker(this.setup.get("dateTimePickerOptions"))},bindMarkdownPreview:function(){var e=window.markdownit(),t=function(t){var i=$(t).val();$(t).parents(".row").find(".markdownPreview").html(e.render(i))};this.ui.markdownInput.bind("keyup",function(){t(this)}),this.ui.markdownInput.bind("click",function(){t(this)})},bindSelectize:function(){this.$('select[type="selectize"]').selectize(),this.$('select[type="multiselectize"]').selectize({persist:!1,maxItems:null,delimiter:","})}}),Crude.Views.FileModule=Crude.Views.Module.extend({template:"#crude_fileModuleTemplate",moduleName:"file",dropzone:"",uploadSuccessfull:!0,errorMesssages:[],maxFiles:10,parallelUploads:10,cleaningUp:!1,ui:{save:"#save",cancel:"#cancel",loader:"#loader",uploadFileDropzone:"#upload_file_dropzone"},save:function(){},initialize:function(e){this.moduleInitialize(e),this.maxFiles=e.hasOwnProperty("maxFiles")?e.maxFiles:this.maxFiles,this.parallelUploads=e.hasOwnProperty("parallelUploads")?e.parallelUploads:this.parallelUploads},onRender:function(){this.parentOnRender(),this.ui.save.hide(100);var e=this;this.ui.uploadFileDropzone.dropzone({headers:{"X-CSRF-Token":$('meta[name="csrf-token"]').attr("content")},url:e.setup.filesRoute("upload"),previewTemplate:$("#crude_dropzoneTemplate").html(),maxFiles:e.maxFiles,parallelUploads:e.parallelUploads,uploadMultiple:!0,autoProcessQueue:!0,init:function(){e.dropzone=this,this.on("success",function(e,t){if(t.success&&"model"in t&&"files"in t.model){var i=_.findKey(t.model.files,{file_original_name:e.name});e.fileLogId=t.model.files[i].file_log_id}}),this.on("successmultiple",function(n,s){s.hasOwnProperty("errors")&&(e.uploadSuccessfull=!1,Crude.showError(s.errors,e.alertContainer())),t(s.model.files),i(),Crude.vent.trigger("action_update",e.setup.getName())}),this.on("removedfile",function(i){i.hasOwnProperty("fileLogId")&&!e.cleaningUp&&$.ajax({dataType:"json",type:"delete",url:e.setup.filesRoute("delete"),data:{file_path:i.serverPath,file_log_id:i.fileLogId,crudeName:e.setup.getName(),crudeModelId:e.model.id},success:function(i){t(i.model.files),Crude.vent.trigger("action_update",e.setup.getName())}})});var t=function(t){e.model.set(e.setup.get("fileAttrName"),t)},i=function(){e.cleaningUp=!0,e.dropzone.removeAllFiles(),e.cleaningUp=!1;var t=e.model.get(e.setup.get("fileAttrName"));_.each(t,function(i,n){var s={name:i.file_original_name,thumb:i.path,serverPath:i.path,fileLogId:i.file_log_id};e.dropzone.emit("addedfile",s),e.dropzone.createThumbnailFromUrl(s,s.serverPath),e.dropzone.files.push(s),e.dropzone.options.maxFiles=e.maxFiles-t.length})};i()},sending:function(t,i,n){n.append("crudeName",e.setup.getName()),n.append("modelId",e.model.id)},dictMaxFilesExceeded:e.setup.interfaceTrans("dictMaxFilesExceeded")})}}),Crude.Views.MapModule=Crude.Views.Module.extend({template:"#crude_mapModuleTemplate",moduleName:"map",map:null,geocoder:null,selectedLocation:null,marker:null,ui:{save:"#save",cancel:"#cancel",clear:"#clear",input:".input",loader:"#loader",mapContainer:"#mapContainer",info:"#info",position:"#position",search:"#search"},initialize:function(e){this.moduleInitialize(e),this.listenTo(Crude.vent,"slide_down_finished",this.refreshMap)},onRender:function(){this.parentOnRender(),Crude.whenAvailable("google",function(){this.initMap()}.bind(this))},save:function(){this.saveModel()},initMap:function(){this.map=new google.maps.Map(this.ui.mapContainer[0],{center:this.getMapCenter(),zoom:6}),this.model.hasLatLngObject()&&(this.marker=this.showNewMarker(),this.showSelectedLocation()),this.map.addListener("click",function(e){this.setMarker(e)}.bind(this)),this.bindSearch()},setMarker:function(e){this.model.set("map_lat",e.latLng.lat()),this.model.set("map_lng",e.latLng.lng()),this.showSelectedLocation(),null===this.marker?this.marker=this.showNewMarker():this.marker.setPosition(this.model.getLatLngObject())},getMapCenter:function(){return this.model.hasLatLngObject()?this.model.getLatLngObject():this.setup.config("mapCenter")},showNewMarker:function(){return new google.maps.Marker({map:this.map,position:this.model.getLatLngObject()})},refreshMap:function(e){e==this.setup.getName()&&(google.maps.event.trigger(this.map,"resize"),this.map.setCenter(this.getMapCenter()))},showSelectedLocation:function(){this.ui.position.html(this.model.get("map_lat")+" x "+this.model.get("map_lng"));var e=new google.maps.Geocoder;e.geocode({location:this.model.getLatLngObject()},function(e,t){if(this.ui.info.html(""),t===google.maps.GeocoderStatus.OK){this.ui.info.html(e[0].formatted_address);var i=e[0].address_components;this.model.set("map_postal_code",this.getComponentOfSelectedLocation(i,"postal_code")),this.model.set("map_province",this.getComponentOfSelectedLocation(i,"administrative_area_level_1")),this.model.set("map_locality",this.getComponentOfSelectedLocation(i,"locality"));var n=this.getComponentOfSelectedLocation(i,"route"),s=this.getComponentOfSelectedLocation(i,"street_number"),a=""===s?"":" "+s;this.model.set("map_address",n+a)}}.bind(this))},getComponentOfSelectedLocation:function(e,t){for(var i in e){var n=e[i],s=_.filter(n.types,function(e){return e==t}).length>0;if(s)return n.long_name}return""},clear:function(){this.model.set("map_lat",null),this.model.set("map_lng",null),this.model.set("map_postal_code",null),this.model.set("map_province",null),this.model.set("map_locality",null),this.model.set("map_address",null),this.marker=null,this.render(),this.save()},bindSearch:function(){var e=this,t=this.ui.search[0],i=this.map,n=new google.maps.places.SearchBox(t);i.controls[google.maps.ControlPosition.TOP_LEFT].push(t),i.addListener("bounds_changed",function(){n.setBounds(i.getBounds())}.bind(this));var s=[];n.addListener("places_changed",function(){var t=n.getPlaces();if(0!==t.length){s.forEach(function(e){e.setMap(null)}),s=[];var a=new google.maps.LatLngBounds;t.forEach(function(t){var n={url:t.icon,size:new google.maps.Size(71,71),origin:new google.maps.Point(0,0),anchor:new google.maps.Point(17,34),scaledSize:new google.maps.Size(25,25)},o=new google.maps.Marker({map:i,icon:n,title:t.name,position:t.geometry.location});s.push(o),google.maps.event.addListener(o,"click",function(t){e.setMarker(t)}),t.geometry.viewport?a.union(t.geometry.viewport):a.extend(t.geometry.location)}),i.fitBounds(a)}})}}),Crude.Views.ThumbnailModule=Crude.Views.Module.extend({template:"#crude_thumbnailModuleTemplate",moduleName:"thumbnail",dropzone:"",uploadSuccessfull:!0,errorMesssages:[],ui:{save:"#save",cancel:"#cancel",loader:"#loader"},save:function(){},onRender:function(){var e=this;_.each(this.setup.get("thumbnailColumns"),function(t){this.$("#upload_file_dropzone_"+t.name).dropzone(e.dropzoneSetup(t.name))}),this.parentOnRender(),this.ui.save.hide(100)},dropzoneSetup:function(e){var t=this;return{headers:{"X-CSRF-Token":$('meta[name="csrf-token"]').attr("content")},url:t.setup.thumbnailRoute("upload"),previewTemplate:$("#crude_dropzoneThumbnailTemplate").html(),maxFiles:1,uploadMultiple:!1,autoProcessQueue:!0,init:function(){t.dropzone=this,this.on("success",function(i,n){return n.success&&(i.serverPath=n.model[e].original_path),n.success?void Crude.vent.trigger("action_update",t.setup.getName()):(t.uploadSuccessfull=!1,void(t.errorMessages=n.errors.file))}),this.on("queuecomplete",function(){return t.uploadSuccessfull?void Crude.vent.trigger("action_update",t.setup.getName()):(_.each(t.errorMessages,function(e){t.dropzone.removeAllFiles(),Crude.showError(e,t.alertContainer())}),void(t.errorMessages=[]))}),this.on("removedfile",function(i){i.hasOwnProperty("serverPath")&&$.ajax({dataType:"json",type:"delete",url:t.setup.thumbnailRoute("delete"),data:{model_id:t.model.id,model_column:e,file_path:i.serverPath,crudeName:t.setup.getName()},success:function(e){t.model=e.model,Crude.vent.trigger("action_update",t.setup.getName())}})});var i=t.model.get(e);if(i){var n={name:i.file_original_name,thumb:i.original_path,serverPath:i.original_path,accepted:!0};t.dropzone.emit("addedfile",n),t.dropzone.createThumbnailFromUrl(n,n.serverPath),t.dropzone.files.push(n)}},sending:function(i,n,s){s.append("crudeName",t.setup.getName()),s.append("modelId",t.model.id),s.append("columnName",e)},maxfilesexceeded:function(e){this.removeAllFiles(),this.addFile(e)}}}}),Crude.Models.RichFilter=Backbone.Model.extend({idAttribute:"name",defaults:{name:"",label:"",type:"text",options:[],value:"",hidden:!0},showWithValue:function(e){this.set("hidden",!1),this.set("value",e)},clearAndHide:function(){this.set("hidden",!0),this.set("value","")},isActive:function(){return!this.get("hidden")&&this.get("value")}}),Crude.Collections.RichFilters=Backbone.Collection.extend({model:Crude.Models.RichFilter,getFiltersValues:function(){var e={};return this.each(function(t){t.isActive()&&(e[t.get("name")]=t.get("value"))}),e}}),Crude.Views.RichFilterListItem=Backbone.Marionette.ItemView.extend({template:"#crude_richFilterListItemTemplate",tagName:"span",ui:{clearRichFilter:".clearRichFilter",richFilterValue:".richFilterValue"},events:{"click @ui.clearRichFilter":"clearRichFilter","change @ui.richFilterValue":"changeRichFilterValue"},className:function(){return this.model.get("hidden")?"hidden":""},initialize:function(e){this.setup=e.setup},serializeData:function(){return{setup:this.setup,model:this.model}},onRender:function(){"datetime"==this.model.get("type")&&this.bindDatepickerInRichFilters()},changeRichFilterValue:function(){var e=$(this.ui.richFilterValue).val();this.model.set("value",e),Crude.vent.trigger("rich_filter_value_change",this.setup.getName())},clearRichFilter:function(){this.model.clearAndHide(),Crude.vent.trigger("rich_filter_value_change",this.setup.getName())},bindDatepickerInRichFilters:function(){var e=this.setup.get("dateTimePickerOptions"),t=_.isEmpty(this.model.get("options"))?e:this.model.get("options"),i=$(this.ui.richFilterValue).parent();i.datetimepicker(t),i.on("dp.hide",function(e){this.changeRichFilterValue()}.bind(this))}}),Crude.Views.RichFilterList=Backbone.Marionette.CompositeView.extend({template:"#crude_richFilterListTemplate",childView:Crude.Views.RichFilterListItem,childViewContainer:"#childViewContainer",tagName:"div",ui:{showRichFilter:"#showRichFilter"},events:{"change @ui.showRichFilter":"showRichFilter"},initialize:function(e){this.setup=e.setup,this.collection=new Crude.Collections.RichFilters(_.values(this.setup.get("richFilters"))),this.listenTo(Crude.vent,"rich_filter_value_change",this.richFilterValueChange),this.getFiltersFromUrlHash(),this.triggerUpdateList()},childViewOptions:function(){return{setup:this.setup}},serializeData:function(){return{setup:this.setup,collection:this.collection}},showRichFilter:function(){var e=$(this.ui.showRichFilter).val(),t=this.collection.get(e);t.showWithValue(""),this.render()},richFilterValueChange:function(e){this.setup.getName()==e&&this.triggerUpdateList()},triggerUpdateList:function(){var e=this.collection.getFiltersValues();Crude.vent.trigger("rich_filters_change",this.setup.getName(),e),this.updateUrlHash(e),this.render()},updateUrlHash:function(e){window.location.hash="";for(var t in e)window.location.hash+="#"+t+"="+e[t]},getFiltersFromUrlHash:function(){var e=window.location.hash.split("#");this.collection.richFilters={};for(var t in e)if(""!=e[t]){var i=e[t].split("="),n=this.collection.get(i[0]);n&&n.showWithValue(i[1])}}}),Crude.Views.ListItem=Backbone.Marionette.ItemView.extend({template:"#crude_listItemTemplate",tagName:"tr",className:function(){var e="crude-table-body-row ";return e+=Crude.data.selectedItem==this.model.get("id")?"active":""},ui:{action:".action",customAction:".customAction","delete":"#delete"},events:{"click @ui.action":"action","click @ui.delete":"delete","click @ui.customAction":"customAction"},initialize:function(e){this.setup=e.setup,this.listenTo(Crude.vent,"item_selected",this.itemSelected)},onRender:function(){this.$('[data-toggle="tooltip"]').tooltip(),this.$('[data-toggle="popover"]').popover({html:!0})},serializeData:function(){return{model:this.model,setup:this.setup}},action:function(e){$(":focus").blur(),Crude.data.selectedItem=this.model.get("id");var t=$(e.target);t.hasClass("action")||(t=t.parents(".action"));var i=t.data("action");this.setup.triggerAction(i,this.model,"#"+this.setup.containerId())},customAction:function(e){$(":focus").blur();var t=$(e.target);t.hasClass("customAction")||(t=t.parents(".customAction"));var i=$("#"+this.setup.containerId()).find("#alertContainer"),n=t.data("action"),s=this.model.get("id"),a=this;$.ajax({url:a.setup.customActionRoute(n,s),type:"get",success:function(e){Crude.showAlert("success",e.data.message,i),Crude.vent.trigger("action_update",a.setup.getName())},error:function(e){a.setup.onAjaxFail(e,i)}})},itemSelected:function(e){this.setup.getName()==e&&(this.model.get("id")==Crude.data.selectedItem?this.$el.addClass("active"):this.$el.removeClass("active"))},"delete":function(){$(":focus").blur(),this.setup.triggerCancel();var e=$("#deleteItemConfirmModal");e.find(".modal-content").html(_.template($("#crude_deleteItemConfirmModalTemplate").html())({setup:this.setup})),e.modal("show");var t=$("#"+this.setup.containerId()).find("#alertContainer");e.find("#confirm").click(function(i){this.model.destroy({wait:!0}).done(function(i){Crude.vent.trigger("action_update",this.setup.getName()),"message"in i&&Crude.showAlert("success",i.data.message,t),e.modal("hide")}.bind(this)).fail(function(i){var n=JSON.parse(i.responseText);422==i.status&&(errors=_.values(n).join("<br>"),Crude.showAlert("danger",errors,t)),403==i.status&&Crude.showAlert("danger",n.error.message,t),e.modal("hide"),this.setup.triggerCancel()}.bind(this))}.bind(this))}}),Crude.Views.ListEmpty=Backbone.Marionette.ItemView.extend({template:"#crude_listEmptyTemplate",tagName:"tr",className:"crude-table-body-row",initialize:function(e){this.setup=e.setup},serializeData:function(){return{setup:this.setup}}}),Crude.Views.List=Backbone.Marionette.CompositeView.extend({template:"#crude_listTemplate",childView:Crude.Views.ListItem,emptyView:Crude.Views.ListEmpty,childViewContainer:"#childViewContainer",tagName:"div",updateTime:"",ui:{updateDelay:"#updateDelay",refresh:"#refresh",add:"#add",order:"#order",sort:".sort",check:"#check",selectColumn:"#selectColumn",changeNumRows:".changeNumRows",changePage:".changePage",changeSearchAttr:".changeSearchAttr",searchValue:"#searchValue",search:"#search",selectedSearchAttr:"#selectedSearchAttr",clearSearch:"#clearSearch"},events:{"click @ui.add":"add","click @ui.order":"order","click @ui.selectColumn":"selectColumn","click @ui.sort":"sort","click @ui.check":"check","click @ui.changeNumRows":"changeNumRows","click @ui.changePage":"changePage","click @ui.changeSearchAttr":"changeSearchAttr","click @ui.search":"search","keyup @ui.searchValue":"searchOnEnter","click @ui.clearSearch":"clearSearch","click @ui.refresh":"updateList"},initialize:function(e){this.setup=e.setup,this.updateTime=Date.now(),this.collection=this.setup.getNewCollection(),this.updateList(),this.listenTo(Crude.vent,"action_update",this.updateThisList),this.listenTo(Crude.vent,"open_add_form",this.add),this.listenTo(Crude.vent,"rich_filters_change",this.richFiltersChange)},childViewOptions:function(){return{setup:this.setup}},serializeData:function(){return{setup:this.setup,sort:this.collection.sortAttributes,pagination:this.collection.pagination,search:this.collection.search}},onRender:function(){$('[data-toggle="tooltip"]').tooltip(),setInterval(function(){var e=Date.now()-this.updateTime;e=parseInt(e/1e3);var t=e%60,i=parseInt(e/60);t=String("00"+t).slice(-2),this.ui.updateDelay.html(i+":"+t)}.bind(this),1e3)},add:function(){$(":focus").blur(),Crude.data.selectedItem=null;var e=_.clone(this.setup.get("actions")),t=this.setup.getNewModel(),i=this.setup.containerId();this.setup.triggerAction(e,t,"#"+i)},sort:function(e){var t=$(e.target);t.hasClass("sort")||(t=t.parents(".sort")),this.collection.changeSortOptions(t.data("attr")),this.updateList()},check:function(){var e=$(".checkboxColumn"+this.setup.getName()),t=$(".checkboxColumn"+this.setup.getName()+":checked"),i=e.length>t.length;e.each(function(){$(this).prop("checked",i)})},order:function(){$(":focus").blur(),this.setup.triggerCancel();var e=$("#"+this.setup.containerId()).find("#alertContainer"),t=this.collection.toJSON(),i=this.setup.get("orderParameters");t=_.sortBy(t,function(e){return parseInt(e[i.orderAttr])});var n=_.template($("#crude_orderedListModalTemplate").html())({list:t,options:i,setup:this.setup}),s=$("#orderedListModal");s.find("#content").html(n),s.modal("show"),s.find("#collection").sortable();var a=_.pluck(t,i.orderAttr);a=_.sortBy(a,function(e){return parseInt(e)});var o=this.setup.orderedListRoute(),r=this;s.find("#confirm").click(function(){var t=[],i=0;s.find("#collection").find("li").each(function(){t.push({id:$(this).data("id"),order:a[i]}),i++}),$.ajax({url:o,type:"post",data:{orderList:t},success:function(t){s.modal("hide"),Crude.vent.trigger("action_update",r.setup.getName()),Crude.showAlert("success",t.data.message,e)},error:function(t){s.modal("hide"),r.setup.onAjaxFail(t,e)}})})},selectColumn:function(){$(":focus").blur();var e=_.template($("#crude_columnSelectorModalTemplate").html())({setup:this.setup}),t=$("#columnSelectorModal");t.find("#content").html(e),t.modal("show"),t.find("#confirm").click(function(){var e=this.setup.get("extraColumn");t.find(".columnCheckbox").each(function(){var t=$(this);e[t.data("name")].visible=t.is(":checked")}),this.setup.set("extraColumn",e),t.modal("hide"),this.render()}.bind(this))},changeNumRows:function(e){var t=$(e.target);this.collection.pagination.numRows=t.html(),this.updateList()},changePage:function(e){var t=$(e.target);this.collection.pagination.page=t.html(),this.updateList()},changeSearchAttr:function(e){var t=$(e.target);this.collection.search.attr=t.data("attr"),this.ui.selectedSearchAttr.html(t.html())},searchOnEnter:function(e){13==e.keyCode&&this.search()},search:function(){this.collection.search.value=this.ui.searchValue.val(),this.updateList()},clearSearch:function(){this.collection.search.attr="id",this.collection.search.value="",this.updateList()},updateList:function(){this.collection.fetchWithOptions().done(function(e){Crude.vent.trigger("fetched_completed"),this.updateTime=Date.now(),this.render()}.bind(this))},updateThisList:function(e){(this.setup.getName()==e||this.setup.config("refreshAll"))&&this.updateList()},richFiltersChange:function(e,t){this.setup.getName()==e&&(this.collection.richFilters=t,this.updateList())}}),Crude.Views.Map=Backbone.Marionette.ItemView.extend({template:"#crude_mapTemplate",tagName:"div",updateTime:"",firstCount:null,markers:[],map:null,geocoder:null,infowindow:null,ui:{mapContainer:"#mapContainer"},initialize:function(e){this.setup=e.setup,this.collection=this.setup.getNewCollection(),this.updateList(),this.listenTo(Crude.vent,"action_update",this.updateThisList),this.listenTo(Crude.vent,"rich_filters_change",this.richFiltersChange)},serializeData:function(){return{setup:this.setup
}},onRender:function(){$('[data-toggle="tooltip"]').tooltip(),Crude.whenAvailable("google",function(){this.initMap()}.bind(this))},initMap:function(){this.map=new google.maps.Map(this.ui.mapContainer[0],{center:this.setup.config("mapCenter"),zoom:6}),this.geocoder=new google.maps.Geocoder,this.infowindow=new google.maps.InfoWindow,this.showMarkers()},addMarker:function(e){var t=e.getLatLngObject(),i=[e.get("map_address"),e.get("map_postal_code")+" "+e.get("map_locality"),e.get("map_province"),e.get("map_lat")+" : "+e.get("map_lng")].join("; "),n=this.markers.push(new google.maps.Marker({map:this.map,position:t,title:i})),s=this.markers[n-1],a={model:e,setup:this.setup};s.addListener("click",function(){this.showInfo(s,a)}.bind(this))},removeAllMarkers:function(){_.each(this.markers,function(e){e.setMap(null)}),this.markers=[]},showInfo:function(e,t){var i=_.template($("#crude_mapInfowindowTemplate").html());this.geocoder.geocode({location:e.getPosition()},function(n,s){s===google.maps.GeocoderStatus.OK&&(t.address=n[0].formatted_address,this.infowindow.setContent(i(t)),this.infowindow.open(this.map,e))}.bind(this))},showMarkers:function(){this.removeAllMarkers(),this.collection.each(function(e){e.hasLatLngObject()&&this.addMarker(e)}.bind(this))},updateList:function(){null!=this.firstCount&&(this.collection.pagination.numRows=this.firstCount),this.collection.fetchWithOptions().done(function(e){Crude.vent.trigger("fetched_completed"),this.updateTime=Date.now(),null==this.firstCount&&(this.firstCount=this.collection.pagination.count),this.showMarkers()}.bind(this))},updateThisList:function(e){(this.setup.getName()==e||this.setup.config("refreshAll"))&&this.updateList()},richFiltersChange:function(e,t){this.setup.getName()==e&&(this.collection.richFilters=t,this.updateList())}}),Crude.Views.Layout=Backbone.Marionette.LayoutView.extend({template:"#crude_layoutTemplate",tagName:"div",className:"",firstRender:!0,title:"",regions:{richFilters:"#richFiltersRegion",list:"#listRegion",form:"#formRegion",map:"#mapRegion",file:"#fileRegion",thumbnail:"#thumbnailRegion"},initialize:function(e){this.setup=e.setup},serializeData:function(){return{setup:this.setup}},onRender:function(){if(this.firstRender){var e=this.setup;this.list.show(new Crude.Views.List({setup:e})),this.setup.isActionAvailable("form")&&this.form.show(new Crude.Views.FormModule({setup:e})),this.setup.isActionAvailable("file")&&this.file.show(new Crude.Views.FileModule({setup:e})),this.setup.isActionAvailable("map")&&this.map.show(new Crude.Views.MapModule({setup:e})),this.setup.isActionAvailable("thumbnail")&&this.thumbnail.show(new Crude.Views.ThumbnailModule({setup:e})),_.isEmpty(e.get("richFilters"))||this.richFilters.show(new Crude.Views.RichFilterList({setup:e})),this.firstRender=!1}$('[data-toggle="tooltip"]').tooltip()}}),Crude.Views.FormActions=Backbone.Marionette.ItemView.extend({template:"#crude_formActionsTemplate",tagName:"div",ui:{action:".action",customAction:".customAction"},events:{"click @ui.action":"action","click @ui.customAction":"customAction"},initialize:function(e){this.setup=e.setup,this.model="model"in e?e.model:this.setup.getNewModel(),this.listenTo(Crude.vent,"action_end",this.render),this.listenTo(Crude.vent,"action_change",this.render)},serializeData:function(){return{setup:this.setup,model:this.model}},onRender:function(){this.$('[data-toggle="tooltip"]').tooltip(),this.ui.action.length+this.ui.customAction.length==1&&this.ui.action.hide()},action:function(e){$(":focus").blur();var t=$(e.target);t.hasClass("action")||(t=t.parents(".action"));var i=t.data("action");this.setup.triggerAction(i,this.model,"#"+this.setup.formContainerId())},customAction:function(e){$(":focus").blur();var t=$(e.target);t.hasClass("customAction")||(t=t.parents(".customAction"));var i=$("#"+this.setup.formContainerId()).find("#alertContainer"),n=t.data("action"),s=this.model.get("id"),a=this;$.ajax({url:a.setup.customActionRoute(n,s),type:"get",success:function(e){Crude.showAlert("success",e.data.message,i),Crude.vent.trigger("action_update",a.setup.getName())},error:function(e){a.setup.onAjaxFail(e,i)}})}}),Crude.Views.FormLayout=Backbone.Marionette.LayoutView.extend({template:"#crude_formLayoutTemplate",tagName:"div",className:"",firstRender:!0,title:"",regions:{actions:"#actionsRegion",form:"#formRegion",map:"#mapRegion",file:"#fileRegion",thumbnail:"#thumbnailRegion"},initialize:function(e){this.setup=e.setup,this.model=this.setup.getNewModel().set(e.modelData)},serializeData:function(){return{setup:this.setup,model:this.model}},onRender:function(){if(this.firstRender){var e={setup:this.setup,slideUpAllow:!1,unlockCancel:!0};this.actions.show(new Crude.Views.FormActions({setup:this.setup,model:this.model})),this.setup.isActionAvailable("form")&&this.form.show(new Crude.Views.FormModule(e)),this.setup.isActionAvailable("file")&&this.file.show(new Crude.Views.FileModule(e)),this.setup.isActionAvailable("map")&&this.map.show(new Crude.Views.MapModule(e)),this.setup.isActionAvailable("thumbnail")&&this.thumbnail.show(new Crude.Views.ThumbnailModule(e)),this.firstRender=!1}this.$('[data-toggle="tooltip"]').tooltip(),this.setup.triggerAction(_.clone(this.setup.get("actions")),this.model,this.el)}}),Crude.Views.MapLayout=Backbone.Marionette.LayoutView.extend({template:"#crude_mapLayoutTemplate",tagName:"div",className:"",firstRender:!0,title:"",regions:{map:"#mapRegion",richFilters:"#richFiltersRegion"},initialize:function(e){this.setup=e.setup},serializeData:function(){return{setup:this.setup}},onRender:function(){if(this.firstRender){var e=this.setup;this.map.show(new Crude.Views.Map({setup:e})),_.isEmpty(e.get("richFilters"))||this.richFilters.show(new Crude.Views.RichFilterList({setup:e})),this.firstRender=!1}$('[data-toggle="tooltip"]').tooltip()}}),$(function(){var e=Crude.getData("crudeSetup",[]),t=$("#crudeContainer");_.each(e,function(e){var e=new Crude.Models.Setup(e),i=e.get("panelView")?" crude-box-panel":"",n=e.containerId();t.append('<div id="'+n+'" class="container crude-box'+i+'"></div>');var s=new Crude.Views.Layout({el:"#"+n,setup:e});s.render()});var i=Crude.getData("crudeMap",[]);$("#crudeMapContainer");_.each(i,function(e){var e=new Crude.Models.Setup(e),i=e.mapContainerId();t.append('<div id="'+i+'" class="container crude-box"></div>');var n=new Crude.Views.MapLayout({el:"#"+i,setup:e});n.render()});var n=Crude.getData("crudeForm",[]),s=$("#crudeFormContainer");_.each(n,function(e){if(!(!1 in e)){var t=new Crude.Models.Setup(e.setup),i=t.formContainerId(),n="model"in e?e.model:{};s.append('<div id="'+i+'" class="container crude-box"></div>');var a=new Crude.Views.FormLayout({el:"#"+i,setup:t,modelData:n});a.render()}}),$('[data-toggle="tooltip"]').tooltip()});