$(document).ready(() => {

    $("#buttarea").click(function() {
        if ($("#tareas").hasClass('esconder')) {
            $("#butinvi").removeClass("is-active")
            $("#buttarea").addClass("is-active")

            $("#tareas").removeClass("esconder")
            $("#iinvi").addClass("esconder")
         } 
    })
    $("#butinvi").click(function() {
        if ($("#iinvi").hasClass('esconder')) {
            $("#buttarea").removeClass("is-active")
            $("#butinvi").addClass("is-active")

            $("#iinvi").removeClass("esconder")
            $("#tareas").addClass("esconder")
         } 
    })
  })