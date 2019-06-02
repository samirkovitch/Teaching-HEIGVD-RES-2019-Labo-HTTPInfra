var Chance = require("chance");
var chance = new Chance();

var express = require("express");
var app = express();

app.get('/', function(req, res){
    res.send(generateDates());
});

app.listen(3000, function(){
    console.log("Accepting HTTP requests on port 3000");
});

function generateDates(){
    var numberOfDates = chance.integer({
        min: 0,
        max: 10
    });

    console.log("Number of dates : " + numberOfDates);

    var dates = [];

    for (var i = 0; i < numberOfDates; ++i){

        var year = chance.year({
            min: 1900,
            max: 2100
        });

        var maxDayFer;

        // Is there a 29th Ferbuary ?
        if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ){
            maxDayFer = 29;
        }
        else{
            maxDayFer = 28;
        }

        var month = chance.month({
            raw: true
        });

        var day;

        if (month.numeric === '02'){
            day = chance.integer({
               min: 1,
               max: maxDayFer
            });
        }
        else if (month.numeric === '04' || month.numeric === '06' || month.numeric === '09' || month.numeric === '11'){
            day = chance.integer({
                min: 1,
                max: 30
            });
        }
        else{
            day = chance.integer({
                min: 1,
                max: 31
            });
        }

        dates.push({
            day: day,
            month: month.short_name,
            year: year,
            hour: chance.hour(),
            minute: chance.minute(),
            second: chance.second(),
            millisecond: chance.millisecond()
        });
    }

    console.log(dates);
    return dates;
}