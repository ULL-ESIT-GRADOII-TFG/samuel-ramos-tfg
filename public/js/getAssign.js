$(document).ready(() => {
  $("#click").click(function() {
    $.post('/groupInvitation/'+ $('#aula').text() + "/" + $('#tarea').text(), { data: $('#tarea').text() }, (data, status) => {})
  })
})
