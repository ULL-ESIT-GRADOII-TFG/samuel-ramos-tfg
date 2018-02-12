$(document).ready(() => {
  $("a.seleccion").click(function() {
    $.post('/orgs', { data: this.id }, (data, status) => {})
  })
})
