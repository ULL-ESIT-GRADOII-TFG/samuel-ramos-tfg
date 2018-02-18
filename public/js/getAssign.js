$(document).ready(() => {
  $("#click").click(function() {
    $.post('/assigninvitation/'+ $('#aula').text() + "/" + $('#tarea').text(), { data: $('#tarea').text() }, (data, status) => {})
  })
})
