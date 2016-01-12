# omg2016tools
將

http://taipeicity.github.io/traffic_realtime/

裡的BUS相關資料集,放到

https://omg2016tools.firebaseio.com/

        var plans = [
            {from: "http://data.taipei/bus/PathDetail", to: "bus01", name: "附屬路線與路線對應資訊"},
            {from: "http://data.taipei/bus/CarInfo", to: "bus02", name: "附屬路線與路線對應資訊"},
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
