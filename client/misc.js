/**
 * Created by OUSSEYNDOU NDOUR on 26/06/2017.
 */

function newXhrObject()
{
    if (self.XMLHttpRequest)
        return new XMLHttpRequest();

    if (self.ActiveXObject)
    {
        var names = [
            "Msxml2.XMLHTTP.6.0",
            "Msxml2.XMLHTTP.3.0",
            "Msxml2.XMLHTTP",
            "Microsoft.XMLHTTP"
        ];

        for(let name of names)
        {
            try
            {
                return new ActiveXObject(name);
            }
            catch(e)
            {

            }
        }
    }

    return null;
}

function fetcher(url, method, data, responseType)
{
    return new Promise(function(resolve, reject){
        var http = newXhrObject();
        if(!http)
        {
            return reject("XMLHttpRequest not supported");
        }

        method = String(method).toUpperCase();

        http.open(method, url, true);
        http.responseType = responseType || 'text/plain';

        if(method === "POST")
        {
            http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        }

        http.onreadystatechange = function() {
            if(http.readyState == 4)
            {
                console.log(http.status, http)
                if(http.status == 200)
                {
                    var response = '';
                    if(responseType === 'text/plain')
                    {
                        response = http.responseText;
                    }
                    else
                    {
                        response = http.response;
                    }

                    resolve({
                        text : function(){
                            return Promise.resolve(response);
                        },
                        json : function(){
                            try
                            {
                                return Promise.resolve(JSON.parse(response));
                            } catch (e)
                            {
                                return Promise.reject(e);
                            }
                        }
                    });
                }
                else
                {
                    reject(http.statusText);
                }
            }
        };

        http.send(buildQuery(data));
    });
}

function buildQuery(data)
{
    data = data || {};

    var query = "";
    for(var i in data)
    {
        query += i + "=" + encodeURIComponent(data[i]) + "&";
    }

    query += "1=1";//trailling &

    return query;
}




var generatePDF = async(function* (url, option)
{

    try {
        var result = yield fetcher(url, "POST", option, 'blob');
    } catch (e) {
        throw new Error(e)
    }

    return result.text();

});

function generateDone(requestResult, $browser){

    $browser.runtime.sendMessage( {
        type:"taskDone",
        requestResult:requestResult
    });
}