
//wait for the document to be loaded to do anything
$(document).ready(function()
{
  $("#reserve-button").click(function()
  {
    $("#reserveModal").modal("show");
  });

  $("#login-button").click(function()
  {
    $("#loginModal").modal("show");
  });

  //sets the automatic sliding interval of the carousel to 2000 ms
  $("#mycarousel").carousel({interval: 2000});

  //activate the pause button's behaviour when the user clicks
  $("#carouselButton").click(function()
  {
    //use the inner span in the button to check for the font awesome icon
    //to decide whether the button is in pause or in play mode
    if ($("#carouselButton").children("span").hasClass("fa-pause"))
    {
      //pause the carousel sliding
      $("#mycarousel").carousel("pause");

      //remove the pause icon class since we clicked, and add the play icon class
      $("#carouselButton").children("span").removeClass("fa-pause");
      $("#carouselButton").children("span").addClass("fa-play");
    }

    else if ($("#carouselButton").children("span").hasClass("fa-play"))
    {
      //start the carousel automatic sliding
      $("#mycarousel").carousel("cycle");

      //remove the play icon class since we clicked, and add the pause icon class
      $("#carouselButton").children("span").removeClass("fa-play");
      $("#carouselButton").children("span").addClass("fa-pause");
    }
  });
});
