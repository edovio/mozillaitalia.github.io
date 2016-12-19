$(function() {
  function encodeData(data) {
    return Object.keys(data).map(function(key) {
      return [key, data[key]].join("=");
    }).join("&");
  }

  var months = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];

  var configData = {
        limit : 0,
        offset : 0,
        country: 'Italy'
    };

  $.ajax({
    url: 'https://reps.mozilla.org/api/v1/event/?' + encodeData(configData),
    dataType: 'jsonp',
    success: function(data) {
      data.objects.reverse();

      $.each(data.objects, function(i, obj) {
        var date = new Date(obj.local_start);
        var categories = '';

        if (obj.categories.length > 1) {
          $.each(obj.categories, function(i, obj) {
            categories += ' - ' + obj.name;
          });
        } else {
          categories = ' - ' + obj.categories[0].name;
        }

        $("#events-list").append(' \
        <div class="row align-center collapse calendar"> \
          <div class="small-10 medium-8 columns calendar-sub"> \
            <div class="row text-center"> \
              <div class="small-2 columns event-date"> \
                <span class="event-day">' + date.getDate() + '</span><br> \
                <span class="event-month">' + months[date.getMonth()] + '</span><br> \
                <span class="event-year">' + date.getFullYear() + '</span> \
              </div> \
              <div class="small-10 columns calendar-text"> \
                <h3><a href="' + obj.event_url + '" target="_blank">' + obj.name + '</a></h3> \
                <p>' + obj.description + '</p> \
                <p class="event-extra-info">' + obj.city + categories + '</p> \
              </div> \
            </div> \
          </div> \
        </div> \
        ');
      });
    }
  });
});
