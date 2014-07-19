$.get("http://api.bootswatch.com/3/", function (data) {
  var themes = data.themes;
  var select = $("#themeswitcher");

  themes.forEach(function(value, index){
    select.append($("<option />")
          .val(index)
          .text(value.name));
  });
  
  select.change(function(){
    var theme = themes[$(this).val()];
    $("link").attr("href", theme.css);
	}).change();

}, "json").fail(function(){
	console.log("bootswatch.js failure");
});
