/**
 * Created by OUSSEYNDOU NDOUR on 26/06/2017.
 */


;(() => {
    var browser = self.browser || self.chrome;
    browser = browser || this.browser ;
    browser = browser || this.chrome ;
    var chrome = browser;
    var isRequesting = false;
    var apiUrl = "https://sidson-aidson-pdf-server.herokuapp.com";
    //var apiUrl = "http://localhost:5000";
    var ressourcePath = "/to-pdf";


    browser.runtime.onMessage.addListener((message, sender) => {
        if (message && message.type === 'generatePDF')
        {

            if(isRequesting)
            {
                return;
            }

            isRequesting = true;
            var option = message.option;
            //option.source =  $('html').html();
            option.source =  window.location.href;

            option.baseUrl = location.protocol+'//'+location.hostname + (location.port ? ':' + location.port: '');

            generatePDF(apiUrl + ressourcePath, option)
                .then((binary) => {
                    isRequesting = false;
                    generateDone({
                        error:false,
                        downloadStartDate: (new Date()).toISOString(),
                        downloadedFileName:option.name,
                        downloadUrl: apiUrl + ressourcePath
                    }, browser);

                    download( new Blob([binary]), option.name, "application/pdf");

                })
                .catch((e) => {
                    console.log(e)
                    isRequesting = false;
                    generateDone({
                        error:true
                    }, browser);
                })
        }
        else if (message && message.type === 'getRequestingStatus')
        {
            browser.runtime.sendMessage({
                type:"sendRequestingStatus",
                isRequesting:isRequesting
            });
        }
    });
})();