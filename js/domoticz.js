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
 
 ;(function ( $, window, document, undefined ) {
 
 // Functions for the API
 
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
	}

	// create a listgroup in a row, eg ("motionsensors", "dashboard-row-1", 3, "motionsensors")
	createDomotizListgroup = function(id, rowid, colwidth, title){
		$("<div></div>")
			.attr("id", id)
			.appendTo("#"+rowid)
			.addClass("list-group col-md-"+colwidth);			
		$("<a></a>")
			.appendTo("#"+id)
			.addClass("list-group-item list-group-item-heading active")
			.text(title);	
	}

	// add listitem to a row, eg (idx, "motionsensors", "motion-pee", "motion-poo")
	createDomoticzListitem = function(idx, listid, item, itemtext, itemclass, labeltext, labelclass){			
		$("<a></a>")
			.attr("id", idx)
			.appendTo("#"+listid)
			.addClass("list-group-item")
			.addClass(itemclass);
		
		$("<span></span>")
			.attr("id", idx+"item")
			.appendTo("#"+idx)
			.addClass("spaced list-group-item-text")
			.text(item);
			

		$("<span></span>")
			.attr("id", idx+"value")
			.text(itemtext)
			.appendTo("#"+idx)
			.text(itemtext)
			.addClass("spaced list-group-item-text");
		
		if (labeltext != null){
		$("<span></span>")
			.text(itemtext)
			.appendTo("#"+idx+"value")
			.text(labeltext)
			.addClass("spaced label pull-right")
			.addClass(labelclass);
    	}
	}
	
	updateDomoticzDashboard = function(){
	
	// empty existing rows (for updating)
	setTimeout(updateDomoticzDashboard, 5000)
	$("#dashboard-row-1").empty();
	$("#dashboard-row-2").empty();
	$("#switches-row-1").empty();
	$("#temps-row-1").empty();
	
	//influence the rows
	createDomoticzRow("dashboard", 1);
	createDomoticzRow("dashboard", 2);
	createDomoticzRow("switches", 1);
	createDomoticzRow("temps", 1);
	var devices = $.getUseddevices()
	devices.result.forEach(function(device,key){

		//detect if it's Forecast.IO :)
		if(device.ForecastStr != undefined && device.forecast_url != undefined){
			
			if (! $('#forecastio').length) {
				createDomotizListgroup("forecastio", "dashboard-row-1", 4, "Weather Forecast")
			}
			
			// little hack (=
			var icon = FixForecastIO(device.ForecastStr)
			
			//another little hack (=
			$("<span></span")
			.attr("id", "forecastioimg")
			.appendTo("#forecastio")
			.addClass("list-group-item text-center")
			
			$("<img></img")
			.appendTo("#forecastioimg")
			.attr("src", "img/"+icon+".png")
			
			switch(device.HumidityStatus) {

				case "Dry":
				var labeltext = device.HumidityStatus;
				var labelclass = "label-warning"
  				break;

  				case "Wet":
  				var labeltext = device.HumidityStatus;
  				var labelclass = "label-warning"
  				break;

  				default:
  				var labelclass = "label-success"
  				var labeltext = "ok";
 				}  
			
			createDomoticzListitem(device.idx, "forecastio" , undefined, device.Data, itemclass, labeltext, labelclass)
			
			
		}
		
		// Temp devices
		if(device.Type == "Temp"){
			
			if (! $('#temp').length) {
				createDomotizListgroup("temp", "temps-row-1", 4, "Temperature")
			}
			
			var tempValue = parseInt(device.Data)
			
			switch(true) {
				
				case  tempValue < 0 :
				var labeltext = "freezing"
				var labelclass = "label-info"
  				break;
  				
				case  tempValue >= 0 && tempValue <= 16:
				var labeltext = "cold"
				var labelclass = "label-info"
  				break;	
				
				case  tempValue >= 20 && tempValue <= 29:
				var labeltext = "warm"
				var labelclass = "label-warning"
  				break;			
				  				
  				case tempValue >= 30:
  				var labeltext = "hot"
  				var labelclass= "label-danger"
  				break;
  				
  				default:
  				var labeltext = "ok"
  				var labelclass = "label-success"
  			
  			

 				}
 				
 				createDomoticzListitem(device.idx, "temp" , device.Name, device.Data, itemclass, labeltext, labelclass)
 			}

		// Temp hum devices
		if(device.Type == "Temp + Humidity"){
			if (! $('#temphum').length) {
				createDomotizListgroup("temphum", "temps-row-1", 4, "Temperature & Humidity")
			}
			
			switch(device.HumidityStatus) {

				case "Dry":
				var labeltext = device.HumidityStatus;
				var labelclass = "label-warning"
  				break;

  				case "Wet":
  				var labeltext = device.HumidityStatus;
  				var labelclass = "label-warning"
  				break;

  				default:
  				var labelclass = "label-success"
  				var labeltext = "ok";
 				}       
			
			createDomoticzListitem(device.idx, "temphum" , device.Name, device.Data, itemclass, labeltext, labelclass)
		}
	
		// On/Off devices
		if(device.SwitchType == "On/Off"){
			
			if (! $('#onoff').length) {
				createDomotizListgroup("onoff", "switches-row-1", 3, "On/Off")
			}
			
			createDomoticzListitem(device.idx, "onoff" , device.Name, device.Status)
		}
		
		// Motion Sensors
		if(device.SwitchType == "Motion Sensor"){
			
			if (! $('#motionsensors').length) {
				createDomotizListgroup("motionsensors", "dashboard-row-1", 3, "Motion Sensors")
			}
			
			
			
			switch(device.Status) {

				case "On":
				var labeltext="motion";
				var labelclass="label-danger";
  				break;

  				default:
  				var labeltext="ok";
  				var labelclass="label-success";
 				}
			//explicitly undifined
			var itemclass = undefined;
			
 			
			createDomoticzListitem(device.idx, "motionsensors" , device.Name, undefined, itemclass, labeltext, labelclass)
		}
		
		// Contacts
		if(device.SwitchType == "Contact"){
			if (! $('#contacts').length) {
				createDomotizListgroup("contacts", "dashboard-row-1", 3, "Contacts")
			}
			
			
			switch(device.Status) {
				case "Open":
				var labeltext = "open";
				var labelclass = "label-danger"
				
  				break;
  				default:
  				var labeltext = "closed";
  				var labelclass= "label-success"
 				}
			
			//explicitly undifined
			var itemclass = undefined;
			
			createDomoticzListitem(device.idx, "contacts" , device.Name,  undefined, itemclass, labeltext, labelclass)
		}

		
	})
}
   
}(jQuery, window, document));

// init variables to start :)
updateDomoticzDashboard();











