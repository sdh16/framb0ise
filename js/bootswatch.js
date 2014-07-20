getDomoticzVariables();
$.get("http://api.bootswatch.com/3/", function (data) {
  var themes = data.themes;
  var select = $("#themeswitcher");
  themes.forEach(function(value, index){
    select.append($("<option />")
          .val(index)
          .text(value.name));
  }); 
select.val(domoticzval.framb0ise_theme).change(); 
  select.change(function(){
    var theme = themes[$(this).val()];
    $("#bootswatch").attr("href", theme.css);
	$.updateUservariable(domoticzidx.framb0ise_theme, "framb0ise_theme", 0, $(this).val());
	}).change();
}, "json").fail(function(){
	console.log("bootswatch.js failure");
});
