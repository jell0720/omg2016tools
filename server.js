// Mark 陳炳陵, 2016-01-12 14:08


// === 1. require section ===
var Firebase = require("firebase");
var schedule = require('node-schedule');
var request = require('request');
var zlib = require('zlib');

var jsonlint = require('jsonlint');

var url_target = "https://omg2016tools.firebaseio.com/";
var firebaseRef = new Firebase(url_target);



// === 2.  ===
function get_option(urlx) {
    return {
        url: urlx,
        headers: {
            'X-some-headers': 'Some headers',
            'Accept-Encoding': 'gzip, deflate',
        },
        encoding: null
    }
}

var plans = [
    {from: "http://data.taipei/bus/PathDetail", to: "bus01", name: "附屬路線與路線對應資訊"},
    {from: "http://data.taipei/bus/CarInfo", to: "bus02", name: "車輛基本資訊"},
    {from: "http://data.taipei/bus/OrgPathAttribute", to: "bus07", name: "路線、營業站對應"},
    {from: "http://data.taipei/bus/PROVIDER", to: "bus08", name: "業者營運基本資料"},
    {from: "http://data.taipei/bus/ROUTE", to: "bus09", name: "路線"},
    {from: "http://data.taipei/bus/ROUTEGeom", to: "bus15", name: "公車路線線型開放格式"},
    // {from:"http://data.taipei/bus/DownloadShp",to:"bus16",name:"公車路線線型 shp 格式"},
    {from: "http://data.taipei/bus/TimeTable", to: "bus03", name: "預定班表資訊"},
    {from: "http://data.taipei/bus/SemiTimeTable", to: "bus04", name: "機動班次時刻表"},
    {from: "http://data.taipei/bus/BUSDATA", to: "bus05", name: "定時車機資訊"},
    {from: "http://data.taipei/bus/BUSEVENT", to: "bus06", name: "定點車機資訊"},
    {from: "http://data.taipei/bus/IStopPath", to: "bus11", name: "智慧型站牌所屬路線"},
    {from: "http://data.taipei/bus/IStop", to: "bus12", name: "智慧型站牌"},
    {from: "http://data.taipei/bus/Stop", to: "bus10", name: "站牌"},
    {from: "http://data.taipei/bus/CarUnusual", to: "bus13", name: "車機異常資訊"},
    {from: "http://data.taipei/bus/StopLocation", to: "bus14", name: "站位資訊"},
    {from: "http://data.taipei/bus/EstiamteTime", to: "bus17", name: "預估到站時間"}
];

firebaseRef.child("plans").set(plans);


plans.forEach(function (plan) {
    console.log("plan => " + plan.from + " " + plan.to + " " + plan.name);
    fetch_one_set_and_show_json_problem(get_option(plan.from), plan.to, plan.name);
})

function fetch_one_set_and_show_json_problem(opt_set, fb_set, name) {
    var onComplete = function (error) {
        if (error) {
            console.log("..." + name + " " + opt_set.url + " =>https://omg2016tools.firebaseio.com/" + fb_set + '...Synchronization failed ######################');
        } else {
            console.log("..." + name + " " + opt_set.url + " =>https://omg2016tools.firebaseio.com/" + fb_set + '...Synchronization succeeded!');
        }
    };

    request.get(opt_set, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            // If response is gzip, unzip first
            var encoding = response.headers['content-encoding']
            if (encoding && encoding.indexOf('gzip') >= 0) {
                zlib.gunzip(body, function (err, dezipped) {
                    try {
                        var json_string = dezipped.toString('utf-8');
                        console.log("..." + opt_set.url + " , 解壓縮, ok! 準備解析json");
                    } catch (err) {
                        console.log("...XXX 壓縮檔有問題 XXX " + name + " " + opt_set.url + " ");
                        return;
                    }

                    // fix "id":"336	",
                    json_string = json_string.replace("	", "");

                    // var json= JSON.parse(json_string);
                    try {
                        var json = jsonlint.parse(json_string);
                        console.log("......" + opt_set.url + " , json, ok! 準備寫入 firebase");
                        firebaseRef.child(fb_set).set(json, onComplete);
                    } catch (err) {
                        console.log("......@@@ json 有問題 @@@" + name + " " + opt_set.url + " ,err = " + err);
                        //   console.log("err = "+err.message);
                    }
                });
            } else {
                // Response is not gzipped
            }
        }
    })
}
