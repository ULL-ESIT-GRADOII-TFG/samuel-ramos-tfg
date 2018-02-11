$(document).ready(() => {
  $(".button-collapse").sideNav()

  $("a").click(function() {
    $.post('/orgs', { id: this.id }, (data, status, jqXHR) => {
      console.log('status: ' + status + ', data: ' + data)
    })
  })
})
