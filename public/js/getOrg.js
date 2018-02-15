$(document).ready(() => {
  $("#click").click(function() {
    $.post('/invitation/' + $('#aula').text(), { data: $('#aula').text() }, (data, status) => {
      window.location.href = window.location.origin + '/classroom/' + $('#aula').text()
    })
  })
})
