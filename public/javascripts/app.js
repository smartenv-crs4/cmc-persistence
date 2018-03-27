$(document).foundation()
$( document ).ready(function() {
  // Attach a submit handler to the form
  $( "#add-historyschedulers, #update-historyschedulers" ).submit(function( event ) {
 var arrayOfElements = $(this).serializeArray();
    // Stop form from submitting normally
    event.preventDefault();

    // Get some values from elements on the page:
    var $form = $( this ),
      terms = objectifyForm(arrayOfElements),
      url = $form.attr( "action" ),
      method = $(this).prop("id") == "add-historyschedulers" ? "POST" : "PUT";

    // Send the data using post
    $.ajax({
      method: method,
      url: url,
      data: terms,
    }).done(function( data ) {
  if(data.id){
    alert('Device with id: ' + data.id + ' Added Successfully!');
  }else{
    alert(data.message);
  }
    })
    .fail(function(){
        alert( "error" );
    });
    });


$('.switch-scheduler').change(function() {
  //  $( '.scheduler-switch').prop('checked', this.checked)
  // Send the data using post
  var $inputScheduler = $(this).find('.input-scheduler'),
    action = 'off';
  if ($inputScheduler.is(':checked')) {
    action = 'on';
  }
  console.log($inputScheduler.data('urlcall') + action + '/');
  $.ajax({
    method: 'GET',
    data: {},
    url: $inputScheduler.data('urlcall') + action + '/'
  }).done(function(data) {
    if (data._id) {
      action == 'on'
        ? alert('Scheduler started successfully!')
        : alert('Scheduler stopped successfully!');
    } else {
      alert(data.message);
    }
  }).fail(function(error) {
    alert("error");
  });
})

});



function objectifyForm(formArray) {//serialize data function

  var returnArray = {};
  for (var i = 0; i < formArray.length; i++){
    returnArray[formArray[i]['name']] = formArray[i]['value'];
  }
  return returnArray;
}
