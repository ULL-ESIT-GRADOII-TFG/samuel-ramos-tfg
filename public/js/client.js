$(document).ready(() => {
  $(".button-collapse").sideNav()

  $("a.seleccion").click(function() {
    console.log("hola");
    $.post('/orgs', { id: this.id }, (data, status, jqXHR) => {
      console.log('status: ' + status + ', data: ' + data)
    })
  })
})
