/**
 * Created by OUSSEYNDOU NDOUR on 26/06/2017.
 */



const wkhtmltopdfPath = process.env.PORT ? './bin/wkhtmltopdf' :  'wkhtmltopdf';
let wkhtmltopdf = require('./wkhtml_fork.js');
wkhtmltopdf.command = wkhtmltopdfPath;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

app.set('port', (process.env.PORT || 5000));


app.use(bodyParser.urlencoded({limit: '5mb', extended: false }));

app.get('/', (req, res) => {
    const fs = require('fs');
    fs.readFile(__dirname + '/view/index.html', function (error, file){
        res.send(file.toString());
    });
});

app.get('/me', (req, res) => {
    const fs = require('fs');
    fs.readFile(__dirname + '/view/me.html', function (error, file){
        res.send(file.toString());
    });
});



app.get('/licence', (req, res) => {
    const fs = require('fs');
    fs.readFile(__dirname + '/view/licence.html', function (error, file){
        res.send(file.toString());
    });
});


app.post('/to-pdf', (req, res) => {

    let url = req.body.source || "";
    const name = req.body.name || "file.pdf";
    const format = req.body.format || "A4";
    const orientation = req.body.orientation || "portrait";
    const baseUrl = req.body.baseUrl || "";
    let zoom = parseInt(req.body.zoom) || 1;
    zoom = zoom >= 1 && zoom <= 100 ? zoom : 1;

    //console.log(url);

    const margin = {
        top: (req.body.marginTop || 0) + "px",
        right: (req.body.marginRight || 0) + "px",
        bottom: (req.body.marginBottom || 0) + "px",
        left: (req.body.marginLeft || 0) + "px"
    };

    //noinspection JSUnresolvedVariable
    const header = {
        height: (req.body.headerHeight || 0) + "px",
        source: req.body.headerSource || ""
    };

    const footer = {
        height: (req.body.footerHeight || 0) + "px",
        source: req.body.footerSource || ""
    };


    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('content-type', 'application/pdf');
    res.header('Content-Disposition', 'attachment; filename=' + name);


    //html = html.replace(/<head.*>/, "<head>" + " <base href='" + baseUrl + ">");
    //html = html.replace(/(src|href\s*=\s*"|')(\/\/[^\/].+?)("|')/gi, function(match, p1, p2, p3) { return p1 + p2.replace('//', '') + p3 })

    wkhtmltopdf({
        input:'"' + url + '"',
        isUrl:true
    }, {
        pageSize: format,
        marginTop:margin.top,
        marginBottom:margin.bottom,
        marginLeft:margin.left,
        marginRight:margin.right,
        orientation:capitalize(orientation),
        loadErrorHandling:'ignore',
        javascriptDelay:'3000',
        zoom:zoom
    })
        .pipe(res);

});

app.listen(app.get('port') , function() {
    console.log('Node app is running on port', app.get('port'));
});