// =========Start Yelp API=========
function restaurantFinder() {

    var yelpAddress = document.getElementById("gmap_where").value;
    var yelpTerms = document.getElementById("gmap_type").value;
    $(".searchResults").empty();

    var auth = {
        consumerKey: '5TBzLTyOV4OVhUrzGgaVBQ', 
        consumerSecret: 'ag4xe5h3-ZGe3huiPQr1j5kX3LE',
        accessToken: 'W2ILo6yUGiwfB4gsmEH8rvBqQjcwNGQh',
        accessTokenSecret: 'yNyEskFCaeehJwzCYJGrNCENtLU',
        serviceProvider: {
        signatureMethod: "HMAC-SHA1"
        }
    };
    var terms = yelpTerms;
    var near = yelpAddress;
    var limit = 12;
    var image_url = 'image_url';
    var rating_img_url_large = 'rating_img_url_large';
    var phone = 'phone';
    var yelpUrl = 'url';

    var accessor = {
      consumerSecret: auth.consumerSecret,
      tokenSecret: auth.accessTokenSecret
    };

    parameters = [];
    parameters.push(['url', yelpUrl]);
    parameters.push(['term', terms]);
    parameters.push(['location', near]);
    parameters.push(['limit', limit]);
    parameters.push(['image_url', image_url]);
    parameters.push(['rating_img_url_large', rating_img_url_large]);
    parameters.push(['phone', phone]);
    parameters.push(['callback', 'cb']);
    parameters.push(['oauth_consumer_key', auth.consumerKey]);
    parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
    parameters.push(['oauth_token', auth.accessToken]);
    parameters.push(['oauth_signature_method', 'HMAC-SHA1']);


    var message = {
      'action': 'http://api.yelp.com/v2/search',
      'method': 'GET',
      'parameters': parameters
    };

    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);
    var parameterMap = OAuth.getParameterMap(message.parameters);
    parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature);
    var bestRestaurant = "Some random restaurant";

    $.ajax({
      'url': message.action,    
      'method': 'GET',
      'data': parameterMap,
      'cache': true,
      'dataType': 'jsonp',
      'jsonpCallback': 'cb',
      'success': function(data, textStats, XMLHttpRequest) {

        // =====This code will print data on the page=========
            var i;
            for(var i=0; i<12; i++){

            var yelpDiv = $('<div>').addClass('restaurantBox');

            var yelpUrlHref = $('<a>').attr('href', data.businesses[i].url).addClass('fancybox fancybox.iframe');

            var img = $('<img>').attr('src', data.businesses[i].image_url).addClass('imageDisplay');

            yelpUrlHref.append(img);

            yelpDiv.append(yelpUrlHref);    

            var bizName = $('<br /><p>').text(data.businesses[i].name).addClass('yelpLabel');
            yelpDiv.append(bizName);

            var ratingImg = $('<img>').attr('src', data.businesses[i].rating_img_url_large).addClass('yelpRating')
            yelpDiv.append(ratingImg);

            var phoneNum = $('<br /><span>').text(data.businesses[i].phone).addClass('yelpPhone')
            yelpDiv.append(phoneNum);

            $(".yelpPhone").text(function(i, text) {
                text = text.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "$1-$2-$3");
                return text;
            });

            $('.searchResults').append(yelpDiv);  

            };
        },
    });
};
// =========End Yelp API=========