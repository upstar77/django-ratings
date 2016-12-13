function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

var csrftoken = getCookie('csrftoken');



function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

$.ajaxSetup({

    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }

    }
});


$(".star").click(function() {
	
	// Collecting data from the webpage
    var actual_span = $(this);
    var content_type_id = $('.global-vote').attr('data-contenttypeid');
    var object_id = $('.global-vote').attr('data-objectid');
    var range = $('.global-vote').attr('data-range');
    var new_vote = actual_span.data('rating');
    var first_vote = false; //Boolean
	// if user is anonymous, or has not voted yet
    if (	($('.user-vote').attr('data-authenticated') == "False") 
			|| ($('.user-vote').attr('data-vote') == 'None')
			|| ($('.user-vote').attr('data-vote') == "0") 
		){
        first_vote = true;
    } else {
        var old_vote = parseInt($('.user-vote').attr('data-vote'));
    }
    var cumul_score = parseInt($('.global-vote').attr('data-cumulscore'));
    var nb_votes = parseInt($('.global-vote').attr('data-votes'));

    // Build the url
    var url = '/rate/' + content_type_id + '/' + object_id + '/' + new_vote + '/';


    $.ajax({
            type: "POST",
            url: url,
            success: function(data) {

                $('.stars .star').removeClass('selected');
                actual_span.addClass('selected');

                if (first_vote) {
                    var new_score = (cumul_score + new_vote) / (nb_votes + 1);
                    new_score = Math.round(new_score);
					
					// Update data in the page
                    $('.stars .mstar').removeClass('selected'); 
                    var span_to_change = $(".stars .mstar").eq(range - new_score); 
                    span_to_change.addClass('selected');
					
                    $('.user-vote').attr('data-vote', new_vote); 
                    $('.global-vote').attr('data-votes', nb_votes + 1); 
                    $('.global-vote').attr('data-score', new_score);
                    $('.global-vote').attr('data-cumulscore', cumul_score + new_vote);
                    $(".nb_voter").html(nb_votes + 1);
					

                } else {
                    var new_score = (cumul_score - old_vote + new_vote) / (nb_votes);
                    new_score = Math.round(new_score);
					
					// Update data in the page
                    $('.stars .mstar').removeClass('selected');
                    var span_to_change = $(".stars .mstar").eq(range - new_score);
                    span_to_change.addClass('selected');
					
                    $('.user-vote').attr('data-vote', new_vote);
                    $('.global-vote').attr('data-score', new_score); 
                    $('.global-vote').attr('data-cumulscore', cumul_score - old_vote + new_vote); 
                }

            },
			// To handle errors
            //error: function (xhr, ajaxOptions, thrownError) {
            //alert(xhr.status);
            //alert(thrownError);
			//}
    });
});