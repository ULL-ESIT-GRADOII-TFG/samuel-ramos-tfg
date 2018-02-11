$(document).ready(() => {
  $(".button-collapse").sideNav();
  $('#test').click(() => {
    console.log($('#test').attr('id'))
    $.post('/orgs', { id: $('#test').attr('id') }, (data, status, jqXHR) => {
         console.log('status: ' + status + ', data: ' + data)
       })
  })
})
