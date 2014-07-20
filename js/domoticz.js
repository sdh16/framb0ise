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

	//return all variables in an easy objects: name = array, name = idx
	//need to have the names & the idx's arond, want to minimize the for.Eache's, so this seams easy :P
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
			.addClass("list-group-item list-item-group-heading active")
			.text(title);	
	}
	

	// add listitem to a row, eg (idx, "motionsensors", "motion-pee", "motion-poo")
	createDomoticzListitem = function(id, listid, item, itemtext, extraclass){			
		$("<a></a>")
			.attr("id", id)
			.appendTo("#"+listid)
			.addClass("list-group-item")
			.addClass(extraclass);
		
		$("<span></span>")
			.appendTo("#"+id)
			.text(item);

		$("<span></span>")
			.text(itemtext)
			.appendTo("#"+id)
			.text(itemtext)
			.addClass("pull-right");
    	
	}
	
	updateDomoticzDashboard = function(){
	// empty existing rows (for updating)
	setTimeout(updateDomoticzDashboard, 5000)
	$("#dashboard-row-1").empty();
	$("#dashboard-row-2").empty();
	$("#switches-row-1").empty();
	//influence the rows
	createDomoticzRow("dashboard", 1);
	createDomoticzRow("dashboard", 2);
	createDomoticzRow("switches", 1);
	
	var devices = $.getUseddevices()
	devices.result.forEach(function(device,key){
	
	
	// device.Type has device.Data per switchtype
	if (device.Type != undefined && device.Data != undefined){
		
		if(device.Type == "Temp"){
			
			if (! $('#temp').length) {
				createDomotizListgroup("temp", "dashboard-row-1", 3, "Temperature")
			}
			
			var tempValue = parseInt(device.Data)
			
			switch(true) {
				case  tempValue >= 20 && tempValue <= 25:
				var extraclass = "list-group-item-info"
  				break;			
				case  tempValue >= 26 && tempValue <= 29:
				var extraclass = "list-group-item-warning"
  				break;
  				case tempValue >= 30:
  				var extraclass = "list-group-item-danger"
  				break;
  				default:
  				var extraclass = ""
 				}
			
		
			
			createDomoticzListitem(device.idx, "temp" , device.Name, device.Data, extraclass)
		}
		
		if(device.Type == "Temp + Humidity"){
			
			if (! $('#temphum').length) {
				createDomotizListgroup("temphum", "dashboard-row-1", 3, "Temperature & Humidity")
			}
			
			switch(device.HumidityStatus) {
				case "Dry":
				var extraclass = "list-group-item-danger"
  				break;
  				case "Wet":
  				var extraclass = "list-group-item-warning"
  				break;
  				default:
  				var extraclass = ""
 				}       
			
			createDomoticzListitem(device.idx, "temphum" , device.Name, device.Data, extraclass)
		}
	}
		
	
	
	// device.SwitchType has device.Status per switchtype
	if (device.Type != undefined && device.Status != undefined){
		
		if(device.SwitchType == "On/Off"){
			
			if (! $('#onoff').length) {
				createDomotizListgroup("onoff", "switches-row-1", 3, "On/Off")
			}
			
			createDomoticzListitem(device.idx, "onoff" , device.Name, device.Status)
		}
		
		if(device.SwitchType == "Motion Sensor"){
			
			if (! $('#motionsensors').length) {
				createDomotizListgroup("motionsensors", "dashboard-row-1", 3, "Motion Sensors")
			}
			
			switch(device.Status) {
				case "On":
				var extraclass = "list-group-item-danger"
  				break;
  				default:
  				var extraclass = ""
 				}
			
			
			createDomoticzListitem(device.idx, "motionsensors" , device.Name, device.Status, extraclass)
		}
		
		if(device.SwitchType == "Contact"){
			if (! $('#contacts').length) {
				createDomotizListgroup("contacts", "dashboard-row-1", 3, "Contacts")
			}
			
			switch(device.Status) {
				case "Open":
				var extraclass = "list-group-item-danger"
  				break;
  				default:
  				var extraclass = ""
 				}
			
			createDomoticzListitem(device.idx, "contacts" , device.Name, device.Status, extraclass)
		}
		
	}
	})
		
}
   
}(jQuery, window, document));

// init variables to start :)
getDomoticzVariables();
updateDomoticzDashboard();











