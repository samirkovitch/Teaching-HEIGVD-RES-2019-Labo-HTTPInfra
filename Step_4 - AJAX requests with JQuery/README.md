# Step 4: AJAX requests with JQuery

### Acceptance criteria

* You have a GitHub repo with everything needed to build the various images.
* You can do a complete, end-to-end demonstration: the web page is dynamically updated every few seconds (with the data coming from the dynamic backend).
* You are able to prove that AJAX requests are sent by the browser and you can show the content of th responses.
* You are able to explain why your demo would not work without a reverse proxy (because of a security restriction).

## Procedure for demo

**Need the containers of previous steps**

### Preparing index.html

In the step 1 sources, we need to add the following lign at the end of the body of index.html
```
<!-- Custom script to load dates -->
<script src="js/dates.js"></script>
```

We also need to change the footer of the site to insert a new id for its text. This id will be used for JQuery
```
<!-- Footer -->
<footer class="bg-black small text-center text-white-50">
    <div class="container">
      <p id="dates-test">Copyright &copy; Your Website 2019</p>
    </div>
</footer>
```

### Preparing the sprit dates.js

In src/, there is dates.js .  We need to copy it to the sources js of the step 1
```
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
```

### Lauch the containers of check

Lauch the containers like in the step 3. To check if the JQuery has worked, we can use the developper tools of the browser and go to the console. We need to see to the console and network. Possibility to choose to only see JS and AJAX (XHR) 