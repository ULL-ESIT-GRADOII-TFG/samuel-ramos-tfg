$(document).ready(() => {
  $("#click").click(function() {
    $.post('/assigninvitation/'+ $('#aula').text() + "/" + $('#tarea').text(), { data: $('#tarea').text() }, (data, status) => {})
    window.location.href = 'https://github.com/' + aula
  })
})
