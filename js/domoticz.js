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
  			url: '/json.htm?type=devices&used=true',
  			async: false,
  			dataType: 'json',
  			success: function (json) {
	  		userVariables = json;
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
	
	createDomoticzDashboard = function(){
		$("<div></div>")
		.attr("id", "row-dashboard-1")
		.appendTo("#dashboard")
		.addClass("row container")
		
		$("<div></div>")
		.attr("id", "motionsensors")
		.appendTo("#row-dashboard-1")
		.addClass("list-group col-md-3")
		
		
		$("<a></a>").appendTo("#motionsensors")
		.addClass("list-group-item active")
		.text("Motion Sensors");
		
		$("<div></div>")
		.attr("id", "contacts")
		.appendTo("#row-dashboard-1")
		.addClass("list-group col-md-3")
		
		
		$("<a></a>").appendTo("#contacts")
		.addClass("list-group-item active")
		.text("Contacts");
		
		$("<div></div>")
		.attr("id", "switches")
		.appendTo("#row-dashboard-1")
		.addClass("list-group col-md-3")
		
		$("<a></a>").appendTo("#switches")
		.addClass("list-group-item active")
		.text("Switches");
		
		$("<div></div>")
		.attr("id", "security")
		.appendTo("#row-dashboard-1")
		.addClass("list-group col-md-3")
		
		$("<a></a>").appendTo("#security")
		.addClass("list-group-item active")
		.text("Security");
		
		$("<a></a>").appendTo("#security")
		.addClass("list-group-item")
		.text("item 1");
		$("<a></a>").appendTo("#security")
		.addClass("list-group-item")
		.text("item 2");
    
		
	}
   
}(jQuery, window, document));

// init variables to start :)
getDomoticzVariables();
createDomoticzDashboard();











