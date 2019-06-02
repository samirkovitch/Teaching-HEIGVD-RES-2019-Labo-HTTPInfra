// New script who needs to be added to the js sources of step 1
$(function(){
    console.log("Loading dates");

    function loadDates(){
        $.getJSON("/api/dates/", function(dates){
            console.log(dates);

            var message = "No dates here...";

            if (dates.length > 0){
                message = dates[0].day + "/" + dates[0].month + "/" + dates[0].year  + ", " + dates[0].hour + ":" + dates[0].minute + ":" + dates[0].second + ":" + dates[0].millisecond;
            }

            $("#dates-test").text(message);
        });
    }

    loadDates();
    setInterval(loadDates, 2500);
});