$(document).ready(() => {
  $(".button-collapse").sideNav()

  $("a.seleccion").click(function() {
    $.post('/orgs', { id: this.id }, (data, status) => {})
  })
})
