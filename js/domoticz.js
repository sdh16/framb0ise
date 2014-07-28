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
	
	// create some tabs & influence order then merge them
	createDomoticzTabs = function(){
		
		var myTabs = {}
		var domoTabs = $.getActiveTabs()

		// second call, buggy json :(
		domoTabs = $.getActiveTabs()	
		
		myTabs.Setup = 1
		myTabs.Dashboard = 1
		myTabs.Rooms = 1
		
				

		var activeTabs = $.extend({}, myTabs, domoTabs.result) 
		
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
					.addClass("col-md-3")
		
				$("<div></div>")
					.attr("id", tabtext + "-col-2")
					.appendTo("#"+ tabtext + "-row")
					.addClass("col-md-3")
		
				$("<div></div>")
					.attr("id", tabtext + "-col-3")
					.appendTo("#" +tabtext +"-row")
					.addClass("col-md-3")
				
				$("<div></div>")
					.attr("id", tabtext + "-col-4")
					.appendTo("#" +tabtext +"-row")
					.addClass("col-md-3")	
			
			}
	
	
		}
			
		})
		
	}	
	
	//update switches
	updateDomoiczSwitches = function(){
		timerSwitches = setTimeout(updateDomoiczSwitches, 5000)
	}
	
	// update Setup
	updateDomoticzSetup = function(){

// themewatch
getDomoticzVariables();
	
	$("<select/>")
			.attr("id", "themes")
			.addClass("form-control")
			.appendTo("#Setup-col-1")
			
	// get & fill the select
	$.get("http://api.bootswatch.com/3/", function (data) {
		var themes = data.themes
		
		themes.forEach(function(value, index){
			
			$('#themes').append($("<option/>", {
				value: index,
				text: value.name
			}));
		})

		$("#themes").val(domoticzval.framb0ise_theme).change();	

	})

}
		
	

	//update dashboard
	updateDomoticzDashboard = function(){
		timerDashboard = setTimeout(updateDomoticzDashboard, 5000)

		var devices = $.getUseddevices()
		var col = 1;
		devices.result.forEach(function(value,key){

		if(value.Favorite != 0){
		
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
		
			// pretty cattegory labels AFTER defining
		switch(category){
			
			case "Contact":
			var categoryLabel = "Contacts"
			break;
			
			case "TempHumidity":
			var categoryLabel = "Temperature & Humidity"
			break;
			
			case "SmokeDetector":
			var categoryLabel = "Smoke Detectors"
			break;
			
			case "OnOff":
			var categoryLabel = "Switches"
			break;
			
			case "Security":
			var categoryLabel = "Security Status"
			break;
			
			case "DuskSensor":
			var categoryLabel = "Dusk Sensors"
			break;
			
			case "General":
			var categoryLabel = "System Status"
			break;
			
			case "Usage":
			var categoryLabel = "Current Usage"
			break;
			
			case "Energy":
			var categoryLabel = "Total Usage"
			break;
			
			case "YouLessMeter":
			var categoryLabel = "Youless Sensors"
			break;
			
			case "TempHumidityBaro":
			var categoryLabel = "Temperature, Humidity & Pressure"
			break;
			
			case "Temp":
			var categoryLabel = "Temperature"
			break;
			
			case "MotionSensor":
			var categoryLabel = "Motion Sensors"
			break;
			
			case "Lux":
			var categoryLabel = "Illuminance"
			break;
			
			default:
			var categoryLabel = category
			break;			
			
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
				.addClass("list-group-item list-group-item-heading active small")
				.text(categoryLabel);
			
			// switch col
				col = col+1;
				if(col==5){col=1}
			
				
			}
			
			// create a row for each device
			if(!$("#" + value.idx).length){
				
				$("<a></a>")
					.attr("id", value.idx)
					.addClass("list-group-item")
					.appendTo("#"+category)
					
			$("<div></div>")
					.attr("id", "line-"+value.idx)
					.appendTo("#"+value.idx)
					.addClass("clearfix list-group-item-text")
			
			$("<button></button>")
					.attr("id", "button-"+value.idx)
					.attr("data-toggle", "collapse")
					.attr("data-target", "#popout-"+value.idx)
					.appendTo("#line-"+value.idx)
					.addClass("spaced pull-left glyphicon glyphicon-chevron-right btn btn-default btn-xs")
			
				$("<span></span>")
					.attr("id", "name-"+value.idx)
					.appendTo("#line-"+value.idx)
					.addClass("small pull-left")
					.text(value.Name)
			
			// add data or status
				
				$("<span></span>")
					.attr("id", "text-" + value.idx)
					.appendTo("#line-"+value.idx)
					.addClass("small pull-right")
					.text(text)
					
			
			}
				
		
			// update text if not the same
			if ($("#text-"+value.idx).text() != text){
				
				$("#text-"+value.idx)
				.hide()
				.text(text)
				.fadeIn(1500)
				
			}
			
			// create more info stuff ?
			if(!$("#popout-"+value.idx).length){
			
			$("<div></div>")
				.attr("id", "popout-"+value.idx)
				.appendTo("#"+value.idx)
				.attr("data-parent", "#"+value.idx)
				.addClass("collapse well")
			
			$("<span></span>")
				.appendTo("#popout-"+value.idx)
				.addClass("small")
				.text("Updated: " + value.LastUpdate)

			if(value.BatteryLevel < 100){

			$("<p></p>")
				.appendTo("#popout-"+value.idx)
				.addClass("list-group-item-text small")
				.text("Battery: " + value.BatteryLevel+"%")
				
				}
					
					
													
			}
			
			


		}

			
			
			
		})
	
}


// !		
		
		}(jQuery, window, document));


$(document).ready(function() {
createDomoticzTabs()
updateDomoticzSetup()

// stop refreshing tabs when not in focus! 
$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {

	// set and clear timers

	switch(e.target.hash){
		case "#tab-Dashboard":
		updateDomoticzDashboard()
		break;
		
		

	}

	switch(e.relatedTarget.hash){
		
		case "#tab-Dashboard":
		clearTimeout(timerDashboard)
		break;
		
		
	}


})

$('.collapse').collapse()

$("#themes").change(function(){
	
	$.get("http://api.bootswatch.com/3/", function (data){
		var themes = data.themes
		var theme = themes[$("#themes").val()];
		$("#bootswatch").attr("href", theme.css);
		$.updateUservariable(domoticzidx.framb0ise_theme, "framb0ise_theme", 0, $("#themes").val());
    })	
})	
$('#Dashboard a[href="#tab-Dashboard"]').tab('show')
});