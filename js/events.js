$(function() {
  function encodeData(data) {
    return Object.keys(data).map(function(key) {
      return [key, data[key]].join("=");
    }).join("&");
  }

  var months = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];

  function next(url=''){
    var configData = {
            limit : 200,
            offset : 0,
            country: 'Italy',
            query: 'italy',
            start__gt: '1970-01-01'
        };
        
    if(url === '') {
        url = 'https://reps.mozilla.org/api/v1/event/?' + encodeData(configData);
    }
    
    $.ajax({
        url: url,
        dataType: 'jsonp',
        success: function(data) {
            if(!data.meta.previous) {
                data.objects.reverse();
            }
            console.log('Found ' + data.objects.length + ' events')
            $.each(data.objects, function(i, obj) {
                var date = new Date(obj.local_start);
                var categories = '';

                if (obj.categories.length > 1) {
                $.each(obj.categories, function(i, obj) {
                    categories += ' - ' + obj.name;
                });
                } else if (typeof obj.categories[0] === "object") {
                categories = ' - ' + obj.categories[0].name;
                }
                htmlblock = ' \
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
                ';
                if(data.meta.previous) {
                    $("#events-list").prepend(htmlblock);
                } else {
                    $("#events-list").append(htmlblock);
                }
            });
            if(data.meta.next) {
                next('https://reps.mozilla.org/' + data.meta.next);
            }
        }
    });
  }
  next();
});
