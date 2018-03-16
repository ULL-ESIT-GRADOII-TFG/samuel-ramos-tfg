$(document).ready(() => {

    $("#butprofile").click(function() {
        if ($("#profile").hasClass('esconder')) {
            $("#butpgroup").removeClass("is-active")
            $("#butpindiv").removeClass("is-active")
            $("#butprofile").addClass("is-active")

            $("#profile").removeClass("esconder")
            $("#pgroup").addClass("esconder")
            $("#pindiv").addClass("esconder")
         } 
    })
    $("#butpgroup").click(function() {
        if ($("#pgroup").hasClass('esconder')) {
            $("#butprofile").removeClass("is-active")
            $("#butpindiv").removeClass("is-active")
            $("#butpgroup").addClass("is-active")

            $("#pgroup").removeClass("esconder")
            $("#profile").addClass("esconder")
            $("#pindiv").addClass("esconder")
         } 
    })
    $("#butpindiv").click(function() {
        if ($("#pindiv").hasClass('esconder')) {
            $("#butprofile").removeClass("is-active")
            $("#butpgroup") .removeClass("is-active")
            $("#butpindiv").addClass("is-active")

            $("#pindiv").removeClass("esconder")
            $("#pgroup").addClass("esconder")
            $("#profile").addClass("esconder")
         } 
    })
  })