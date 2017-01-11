(function() {
  'use strict';


  // add validation method to compare input date to current date
  $.validator.addMethod("mindate", function (value, element) {

    // get the current date in local time for comparison
    var d = new Date();
    var month = d.getMonth()+1;
    var day = d.getDate();
    var now = d.getFullYear() + '-' +
      (month<10 ? '0' : '') + month + '-' +
      (day<10 ? '0' : '') + day;

    // console.log('Input date: ', value);
    // console.log('Now date for comparison: ', now);

    return this.optional(element) || value >= now;

  });

  // add validation method to compare drop-off date to pick-up date
  $.validator.addMethod("returndate", function (value, element) {

    var pickUpDate = $('#pick-up-date').val();

    // console.log('Input date: ', value);
    // console.log('Pick up date for comparison: ', pickUpDate);

    return this.optional(element) || value > pickUpDate;

  });


  // function to control validation of the rental search form using jQuery Validate
  function searchValidation() {

    $("#search-form").validate({
      // handle general invalid submission message
      invalidHandler: function(event, validator) {
        var errors = validator.numberOfInvalids();
        if (errors) {
          var message = "<strong>Oops!</strong> Looks like you missed something. All fields are required, so please check below for the missing information.";
          $("#search-form-notifications").html(message);
          $("#search-form-notifications").addClass('message-errors-visible');
        } else {
          $(".search-form-notifications").hide();
        }
      },
      // handle submission of valid form
      submitHandler: function(form, e) {
        e.preventDefault();

        // console.log('running submit handler.');

        var pickUpLocation = $('#pick-up-location').val();

        var pickUpDate = $('#pick-up-date').val();
        pickUpDate = pickUpDate.substr(5, 2) + '/' + pickUpDate.substr(8, 2) + '/' + pickUpDate.substr(0, 4);

        var dropOffDate = $('#drop-off-date').val();
        dropOffDate = dropOffDate.substr(5, 2) + '/' + dropOffDate.substr(8, 2) + '/' + dropOffDate.substr(0, 4);

        getAvailableCars(pickUpLocation, pickUpDate, dropOffDate);

      },
      // handle message placement if field invalid
      errorElement: "span",
      errorPlacement: function(error, element) {
        var placement = $(element).data('error');
        if (placement) {
          $(placement).append(error);
        } else {
          error.insertAfter(element);
        }
      },
      // set the validation rules
      rules: {
      'pick-up-location': {
        digits: true,
        minlength: 5,
        maxlength: 5,
        required: true
      },
      'pick-up-date': {
        required: true,
        date: true,
        mindate: true
      },
      'drop-off-date': {
        required: true,
        date: true,
        mindate: true,
        returndate: true
      },
    },
    // set the messages returned if invalid
    messages: {
      'pick-up-location': {
        minlength: 'Please enter a 5 digit zip code.',
        maxlength: 'Please enter a 5 digit zip code.',
        digits: 'Please enter a 5 digit zip code.',
        required: 'Please enter a 5 digit zip code.'
      },
      'pick-up-date': {
        required: 'Please select a pick-up date.',
        date: 'Please select a pick-up date.',
        mindate: 'Please select a future date.'
      },
      'drop-off-date': {
        required: 'Please select a drop-off date.',
        date: 'Please select a drop-off date.',
        mindate: 'Please select a future date.',
        returndate: 'Date must be > pick up date.'
      },
    }

    });

  }

  // function to populate car search results via the Hotwire.com Rental Car Search API via AJAX
  function getAvailableCars(pickUpLocation, pickUpDate, dropOffDate) {

    var queryURL = '//api.hotwire.com/v1/search/car?apikey=vddxn5q8maz65xbty36e7uw2&format=jsonp&dest='+pickUpLocation+'&startdate='+pickUpDate+'&enddate='+dropOffDate+'&pickuptime=24:00&dropofftime=24:30';

    $('body .search-wrap').prepend('<span class="loader-wrap"><svg class="loader" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><style type="text/css"/><path class="st0 wheel-component" d="M40 0C18 0 0 18 0 40s18 40 40 40 40-18 40-40S62 0 40 0zM40 68c-15 0-28-12-28-28 0-15 12-28 28-28S68 25 68 40 55 68 40 68z"/><path class="st0 wheel-component" d="M65 38c0-4-2-8-4-11 -4 5-11 7-15 4 -4-3-4-10-1-15C44 15 42 15 40 15s-4 0-6 1c4 6 3 12-1 15S23 32 19 27c-2 3-3 7-4 11 6-2 13 1 14 5 2 5-2 10-8 13 3 3 6 6 10 7 0-7 4-12 10-12s9 5 10 12c4-1 7-4 10-7 -6-2-10-8-8-13C52 39 59 36 65 38zM40 48c-4 0-8-4-8-8s4-8 8-8 8 4 8 8S44 48 40 48z"/><circle class="st0 wheel-component" cx="40" cy="40" r="5"/></svg></span>');

    // get our available car information from Hotwire via JSONP to avoid cross-domain access restrictions
    $.ajax({
      type: "GET",
      url: queryURL,
      dataType: 'jsonp',
      jsonpCallback: 'callback',

      // handle a successful call to the Hotwire API
      success:function(data){

        // console.log(data);

        // remove the loader spinner
        $('.loader-wrap').remove();

        // remove old search results
        $('#results').empty();

        $('#results').append('<div id="search-criteria" class="group"><p><strong>Your Search</strong><span><span>Location</span> '+pickUpLocation+' <span class="spacer">&nbsp;&nbsp;</span><span>Pick-up Date</span> '+pickUpDate+' <span class="spacer">&nbsp;&nbsp;</span><span>Drop-off Date</span> '+dropOffDate+'</p></span></div>');

        // generally handle API errors if no results are populated
        if(!data.hasOwnProperty('Result')) {
          alert('There were was an problem processing you request.. The specific error was "'+ StatusDesc +'"');
          return false;
        }

        // populate results
        $.each( data.Result, function(i, result) {
          $('#results').append('<div class="result" data-id="'+result.ResultId+'" data-ref="'+result.HWRefNumber+'" data-car-type-code="'+result.CarTypeCode+'"><div class="result-col result-image-col"><img class="result-image" src="/dist/svg/cars/'+result.CarTypeCode+'.svg" alt="'+result.CarTypeCode+'"></div><div class="result-col"><p><strong>Daily Rate:</strong> $'+result.DailyRate+'</p><p><strong>Subtotal:</strong> $'+result.SubTotal+'</p><p><strong>Taxes/Fees</strong>: $'+result.TaxesAndFees+'</p><h3>$'+result.TotalPrice+'</h3><a class="rent-link" href="'+ result.DeepLink +'" target="_blank">Rent</a></div></div>');

        });

        // add additional car meta/details to results
        $.each( data.MetaData.CarMetaData.CarTypes, function(i, result) {
          var carTypeCode = result.CarTypeCode;
          $('#results .result[data-car-type-code="'+result.CarTypeCode+'"] .result-col:first-of-type').after('<div class="car-type-details result-col"><h2>'+result.CarTypeName+'</h2><p>'+result.PossibleModels+'</p><p><strong>Features: </strong>'+result.PossibleFeatures+'</p><p><strong>Seating: </strong>'+result.TypicalSeating+'</p></div>');
        });

        // smoothly scroll to the top of the results wrapper
        $('body').scrollTo('.results-wrap', {
          duration: 600,
          offset: -0
        });

      },

      // handle errors connecting to the Hotwire API
      error:function(){
         alert("There was an error connecting to the search API. Please try again or contact the developer if this continue to happen.");
      }
    });

  }

  $(document).ready(function(){

    // init validation
    searchValidation();

  });



})();
