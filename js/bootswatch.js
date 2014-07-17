$.get("http://api.bootswatch.com/3/", function (data) {
  var themes = data.themes;
  var select = $("#themeswitcher");
  select.show();
  $(".alert").toggleClass("alert-info alert-success");
  $(".alert h4").text("Success!");
  
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
    $(".alert").toggleClass("alert-info alert-danger");
    $(".alert h4").text("Failure!");
});
