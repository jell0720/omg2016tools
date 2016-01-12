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


plans.forEach(function (plan) {
    firebaseRef.child("plan_"+plan.to).set(plan);
    console.log("plan => " + plan.from + " " + plan.to + " " + plan.name);
    fetch_one_set_and_show_json_problem(get_option(plan.from), plan.to, plan.name);
})

function fetch_one_set_and_show_json_problem(opt_set, fb_set, name) {
    var onComplete = function (error) {
        if (error) {
            console.log("------"+ fb_set + name + " " + opt_set.url + " =>https://omg2016tools.firebaseio.com/" + fb_set + '...Synchronization failed ######################');
        } else {
            console.log("------" + fb_set+ name + " " + opt_set.url + " =>https://omg2016tools.firebaseio.com/" + fb_set + '...Synchronization succeeded!');
        }
    };

    request.get(opt_set, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            // If response is gzip, unzip first
            var encoding = response.headers['content-encoding'];
            if (encoding && encoding.indexOf('gzip') >= 0) {
                zlib.gunzip(body, function (err, dezipped) {
                    try {
                        var before=dezipped.length.toLocaleString();
                        var json_string = dezipped.toString('utf-8');
                        console.log("--"+ fb_set  + name +" size=" +before+" , 解壓縮, ok! 準備解析json, size="+json_string.length.toLocaleString());
                        
                    } catch (err) {
                        console.log("--XXX 壓縮檔有問題 XXX " + fb_set + name + " " + opt_set.url + " ");
                        return;
                    }

                    // fix "id":"336	",
                    json_string = json_string.replace("	", "");

                    // var json= JSON.parse(json_string);
                    try {
                        var json = jsonlint.parse(json_string);
                        console.log("--" + fb_set + name + " , json, ok! 準備寫入 firebase");
                        firebaseRef.child(fb_set).set(json, onComplete);
                    } catch (err) {
                        console.log("--@@@ json 有問題 @@@"+ fb_set  + name + " " + opt_set.url + " ,err = " + err);
                        //   console.log("err = "+err.message);
                    }
                });
            } else {  // PathDetail 附屬路線與路線對應資訊 1/12 20:52 跑到這邊來了
                      // 
                // Response is not gzipped
                 // fix "id":"336	",
                    
                    // var json_string = body.replace("	", "");
                    var json_string=body;
                    console.log("xx"+ fb_set  + name +" , 不是完整的壓縮檔案, 先取能解壓縮的部份,再解析json");
                    console.log("===============");
                    console.log("http://www.gzip.org/recover.txt");
                    console.log("===============");
                    
                    
                    // https://fetch-bus01-twoutlook.c9users.io/get01.php?url=http://data.taipei/bus/PathDetail
                    var url2="https://fetch-bus01-twoutlook.c9users.io/get01.php?url="+opt_set.url;
                    
                    
                    var request = require('request');
                      request(url2, function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                          //console.log(body) // Show the HTML for the Google homepage.
                          
                            try {
                          var json = jsonlint.parse(body);
                        console.log("--" + fb_set + name + " , json, ok! 準備寫入 firebase");
                        firebaseRef.child(fb_set).set(json, onComplete);
                    } catch (err) {
                       console.log("text:"+body.substr(1,100));
                      
                       console.log("err.message:"+err.message);
                       console.log("err.name:"+err.name);
                       
                        console.log("--@@@ json 有問題 @@@"+ fb_set  + name + " " + opt_set.url + " ,err = " + err);
                        //   console.log("err = "+err.message);
                    }
                          
                          
                          
                        }
                      })
                    
                    
                    
                    
                    // request.get(get_option(url2), function (error, response, body) {
                       
                    //     var json= JSON.parse(body);
                    // try {
                    //     var json = jsonlint.parse(json_string);
                    //     console.log("--" + fb_set + name + " , json, ok! 準備寫入 firebase");
                    //     firebaseRef.child(fb_set).set(json, onComplete);
                    // } catch (err) {
                    //     console.log("--@@@ json 有問題 @@@"+ fb_set  + name + " " + opt_set.url + " ,err = " + err);
                    //     //   console.log("err = "+err.message);
                    // }
                       
                    // });
                    
                    
                  
                
                
                
            }
        }
    })
}
