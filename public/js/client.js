$(document).ready(() => {
  $('#test').click(() => {
    console.log($('#test').attr('id'))
    $.post('/orgs', { myData: $('#test').attr('id') }, (data, status, jqXHR) => {
         console.log('status: ' + status + ', data: ' + data)
       })
  })
})
