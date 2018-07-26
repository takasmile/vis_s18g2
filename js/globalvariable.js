var COUNTRY_NUM = 70;
var COUNTRY_NAME = new Array();

function init_country_name() {
    d3.csv("data/team_total.csv", function(error, csvdata) {
        if (error) {
            console.log(error);
        }
        // console.log(csvdata);
        for (var i = 0; i < COUNTRY_NUM; i++) {
            COUNTRY_NAME[i] = csvdata[i].team;
            // console.log(String(i) + " " + COUNTRY_NAME[i])
        }
    })
}