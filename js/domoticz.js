/*
 *  Project: Domoticz plugin
 *  Description: library of functions that use the Domoticz API for use with JQuery projects
 *  Author: Sander Filius
 *  License: MIT
 *
 *	Implemented:
 *	
 *	uservariables by CopyCatz (very awesome & great improvement to Domoticz!)
 *	
 *
 */
 
 ;(function ( $, window, document, undefined ){
 
 // Functions for the API
 
 	// get active tabs
 	$.getActiveTabs = function() {
 	 var activeTabs = [];
 	 
 	 $.ajax({
  			url: '/json.htm?type=command&param=getactivetabs',
  			async: false,
  			dataType: 'json',
  			success: function (json) {
	  		activeTabs = json;
	  		}
	  	});
	  return activeTabs;
 	 }
  
  
 
 	// get all used devices
 	 $.getUseddevices = function(){
 	 var usedDevices = [];
 	 
 	 $.ajax({
  			url: '/json.htm?type=devices&used=true&order=Name',
  			async: false,
  			dataType: 'json',
  			success: function (json) {
	  		usedDevices = json;
	  		}
	  	});
	  return usedDevices;
 	 }

 	//get all uservariables return as array
	 $.getUservariables = function() {
		var userVariables = [];
		
		$.ajax({
  			url: '/json.htm?type=command&param=getuservariables',
  			async: false,
  			dataType: 'json',
  			success: function (json) {
	  		userVariables = json;
	  		}
	  	});
	  	
	return userVariables;
	}

	// get specified uservariable, return as array
 	$.getUservariable = function(idx) {
		var userVariable = [];
		
		$.ajax({
  			url: '/json.htm?type=command&param=getuservariable&idx='+idx,
  			async: false,
  			dataType: 'json',
  			success: function (json) {
	  		userVariable = json;
	  		}
	  	});
	  return userVariable;
	  }
	  
 	// try to save a variable & return results as object
	/* 	0 = Integer, e.g. -1, 1, 0, 2, 10  
	*		1 = Float, e.g. -1.1, 1.2, 3.1
	*		2 = String
	*		3 = Date in format DD/MM/YYYY
	*		4 = Time in 24 hr format HH:MM
	*/		
	$.saveUservariable = function(vname, vtype, vvalue){
		  var result = [];
		
		$.ajax({
  			url: '/json.htm?type=command&param=saveuservariable&vname='+vname+'&vtype='+vtype+'&vvalue='+vvalue,
  			async: false,
  			dataType: 'json',
  			success: function (json) {
	  		result = json;
	  		}
	  	});

	  return result;
	  }

	//try to update a variable & return results as object
	$.updateUservariable = function(idx, vname, vtype, vvalue){
		var result = [];
	
		$.ajax({
  			url: '/json.htm?type=command&param=updateuservariable&idx='+idx+'&vname='+vname+'&vtype='+vtype+'&vvalue='+vvalue,
  			async: false,
  			dataType: 'json',
  			success: function (json) {
	  		result = json;
	  		}
	  	});

	  return result;
}

	//	try to delete a variable, print results to console & return results as object
	$.deleteUservariable = function(idx){
		var result = [];
	
		$.ajax({
  			url: '/json.htm?type=command&param=deleteuservariable&idx='+idx,
  			async: false,
  			dataType: 'json',
  			success: function (json) {
	  		result = json;
	  		}
	  	});

	  	console.log(result.title, idx, result.status);
	  	return result;
}

// Funtions for the webinterface

	// fix forecastIO implementation ;)
	function FixForecastIO(ForecastStr){
 var a = new Date();
 
 var icon ="";
     
     var hour = a.getHours();
          
	if (ForecastStr == "Rain") {
		icon = icon+"rain";
	}
     
        if (ForecastStr == "Cloudy") {
		icon = icon+"partly-cloudy-";
	}
     
        if (ForecastStr == "Partly Cloudy") {
		icon = icon+"partly-cloudy-";
	}
	
	if (ForecastStr == "Sunny") {
		icon = icon+"clear-";
	}

     // my poor definition of 'night' :P
	if (hour >= 0 && hour <= 6 && ForecastStr != "Rain") {
		icon = icon +"night";
	}
     
     // my poor defintion of 'day' :P
	if (hour >= 7 && hour <= 23 && ForecastStr != "Rain") {
		var icon = icon +"day";
	}
     
     return icon;
 }

	//return all variables in an easy objects: name = array, name = idx
	//need to have the names & the idx's arond, want to minimize the for.Eache's, so this seems easy :P
	// very sucky functions, needs fixing
	getDomoticzVariables = function(){
		domoticzval = {};
		domoticzidx = {};
		
		var variables = $.getUservariables();
		if (variables.result != undefined){
		variables.result.forEach(function(value,key){
			domoticzval[value.Name] = value.Value;
			domoticzidx[value.Name] = value.idx;
			})
			}
	
	//defaults
	
	if (!domoticzval.framb0ise_theme){$.saveUservariable("framb0ise_theme", 0, 0)}
	
	return domoticzval;
	return domoticzidx;
	}
	
	//create a row in a tab, eg (1, 1, "dashboard") -> produces id="dashboard-row-1"
	createDomoticzRow = function(tab, row){
		$("<div></div>")
			.attr("id", tab+"-row-"+row)
			.appendTo("#"+tab)
			.addClass("row container")
			
		$("<div></div>")
			.attr("id", "dashboard-col-1")
			.appendTo("#" + tab +"-row-" +row)
			.addClass("col-md-4")
		$("<div></div>")
			.attr("id", "dashboard-col-2")
			.appendTo("#" + tab +"-row-" +row)
			.addClass("col-md-4")
		$("<div></div>")
			.attr("id", "dashboard-col-3")
			.appendTo("#" + tab +"-row-" +row)
			.addClass("col-md-4")
	

			
		
			}

	// create some tabs
	createDomoticzTabs = function(){
		
		var myTabs = {}
		myTabs.Dashboard = 1;
		myTabs.Switches
		myTabs.Scenes
				
		var domoTabs = $.getActiveTabs()
		domoTabs.result.Setup = 1;
		
		var activeTabs = $.extend({}, myTabs, domoTabs.result) 
		
		console.log(activeTabs)
		
		//add Dashboard, Settings & Log
		
		
		
		$.map(activeTabs,function(value,index){
				
		if (value == "1"){
			var tabid = index.replace("Enable", "")
			var tabtext = index.replace("EnableTab", "")
			if(!$("#"+tabid).length){
				tabid = index.replace("Enable", "")
				tabtext = index.replace("EnableTab", "")
			
			
				$("<li></li>")
					.attr("id",tabid)
					.appendTo("#tabs")
					
				$("<a></a>")
					.appendTo("#"+tabid)
					.attr("href", "#tab-"+tabtext)
					.attr("data-toggle", "tab")
					.text(tabtext)
					
				$("<div></div>")
					.attr("id", "tab-"+tabtext)
					.appendTo("#tab-content")
					.addClass("container tab-pane")
							
				$("<div></div>")
					.attr("id", tabtext+"-row")
					.appendTo("#tab-"+tabtext)
					.addClass("row container")
			
				$("<div></div>")
					.attr("id", tabtext + "-col-1")
					.appendTo("#"+tabtext +"-row")
					.addClass("col-md-4")
		
				$("<div></div>")
					.attr("id", tabtext + "-col-2")
					.appendTo("#"+ tabtext + "-row")
					.addClass("col-md-4")
		
				$("<div></div>")
					.attr("id", tabtext + "-col-3")
					.appendTo("#" +tabtext +"-row")
					.addClass("col-md-4")

			
			
			
			
			}
			
// <div id="dashboard" class="container tab-pane"></div>

// <ul class="nav nav-pills" id="tabs">
// <li class="active"><a href="#home" data-toggle="tab"><span class="glyphicon glyphicon-home"></span>&nbsp;Home</a></li>

			
			
		}
			
		})
		
	}	

	//update dashboard (main loop)
	updateDomoticzDashboard = function(){

		createDomoticzTabs()

		if (!$('#dashboard-row-1').length) {
			createDomoticzRow("dashboard", 1);
		}
	
		
	
	setTimeout(updateDomoticzDashboard, 5000)
	
		var devices = $.getUseddevices()
		var col = 1;
		var count = 0;
		devices.result.forEach(function(value,key){

		//check if DOM elements for device.type exist
		switch(value.SwitchType){
			
			// break up categories into Type or SwitchType
			
			case undefined:
			var category = value.Type.replace(/[_\s]/g, '').replace(/[^a-z0-9-\s]/gi, '');
			var text = value.Data
			break;
			
			default:
			var category = value.SwitchType.replace(/[_\s]/g, '').replace(/[^a-z0-9-\s]/gi, '');
			var text = value.Status	
		}

			// create the headings for each devicetype
			if(!$("#" + category ).length) {
				$("<div></div>")
				.attr("id", category)
				.appendTo("#Dashboard-col-"+col)
				.addClass("list-group")
				
				$("<a></a>")
				.attr("id", category)
				.appendTo("#" + category)
				.addClass("list-group-item list-group-item-heading active")
				.text(category);
			
			// max 5 lists on a column?
				count = count+1;
				if(count>5){col=col+1; count=0}
			
				
			}
			
			// create a row for each device
			if(!$("#" + value.idx).length){
				
				$("<a></a>")
					.attr("id", value.idx)
					.appendTo("#"+category)
					.addClass("list-group-item")
					.text(value.Name);
			
			// add data or status
				
				$("<span></span>")
					.attr("id", "text-" + value.idx)
					.appendTo("#"+value.idx)
					.addClass("list-group-item-text pull-right")
					.text(text)
					
			}
		
			// update text if not the same
			if ($("#text-"+value.idx).text() != text){
				
				$("#text-"+value.idx)
				.hide()
				.text(text)
				.fadeIn(1500)
				
			}
			
			// create a popover with ?
			if(!$("#popover-"+value.idx).length){
			
			$("#"+value.idx)
					.attr("rel", "popover")
					.attr("data-toggle", "popover")
					.attr("data-placement", "right")
					.attr("data-content", value.LastUpdate)
					.attr("title","LastUpdate")
					.attr("data-container", "body")			
			}
			
			// update popover
			if($("#"+value.idx).attr("data-content") != value.LastUpdate){
			$("#"+value.idx)
			.attr("data-content", value.LastUpdate)				
			}




			
			
			
		})
}
// !		
		
		}(jQuery, window, document));

$(document).ready(function() {

// init variables to start :)
updateDomoticzDashboard();
// init popovers
$("a[rel=popover]").popover();
// dismissable popovers
$('body').on('click', function (e) {
    $('[data-toggle="popover"]').each(function () {
    //the 'is' for buttons that trigger popups
    //the 'has' for icons within a button that triggers a popup
    if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
    $(this).popover('hide');
    }
    });
});

});