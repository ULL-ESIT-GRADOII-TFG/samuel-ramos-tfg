$(document).ready(() => {

    $("#butrepos").click(function() {
        if ($("#repos").hasClass('esconder')) {
            $("#butinvi").removeClass("is-active")
            $("#buteval").removeClass("is-active")
            $("#butrepos").addClass("is-active")

            $("#repos").removeClass("esconder")
            $("#ainvi").addClass("esconder")
            $("#eval").addClass("esconder")
         } 
    })
    $("#butinvi").click(function() {
        if ($("#ainvi").hasClass('esconder')) {
            $("#butrepos").removeClass("is-active")
            $("#buteval").removeClass("is-active")
            $("#butinvi").addClass("is-active")

            $("#ainvi").removeClass("esconder")
            $("#repos").addClass("esconder")
            $("#eval").addClass("esconder")
         } 
    })
    $("#buteval").click(function() {
        if ($("#eval").hasClass('esconder')) {
            $("#butinvi").removeClass("is-active")
            $("#butrepos").removeClass("is-active")
            $("#buteval").addClass("is-active")

            $("#eval").removeClass("esconder")
            $("#repos").addClass("esconder")
            $("#ainvi").addClass("esconder")
         } 
    })
  })