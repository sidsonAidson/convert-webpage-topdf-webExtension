$(document).ready(() => {
    var browser = self.browser || self.chrome;
    var chrome = browser;
    var send = $("#send");

    send.text(browser.i18n.getMessage("convertButton"));

    send.on("click", () => {
       var option = {
           name:$("#output_name").val() || "file.pdf",
           format:$('input[name=format]:checked').val() || "",
           orientation:$('input[name=orientation]:checked').val() || "",
           marginTop:$("#margin_top").val() || 0,
           marginRight:$("#margin_right").val() || 0,
           marginBottom:$("#margin_bottom").val() || 0,
           marginLeft:$("#margin_left").val() || 0,
           zoom: $("#zoom").val() || 1
       };

        send.addClass('disabled').prop('disabled', true);
        //$('.progress').removeClass('hidden');

        browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
            browser.tabs.sendMessage(tabs[0].id, {
                type:"generatePDF",
                option:option
            });

            browser.runtime.sendMessage( {
                type:"showProgressPar"
            });

            window.close();
        });
    });

    browser.runtime.onMessage.addListener((message, sender) => {
        if (message && message.type === 'sendRequestingStatus')
        {
            var isRequesting = message.isRequesting;

            if(isRequesting)
            {
                send.addClass('disabled').prop('disabled', true);
                $('.progress').removeClass('hidden');
            }
        }
        else  if (message && message.type === 'taskDone')
        {
            var requestResult = message.requestResult;
            if(requestResult.error)
            {
                send.removeClass('disabled').prop('disabled', false);
                $('.progress').addClass('hidden');
                window.close();
            }
            else
            {
                window.close();
            }
        }
    });

    browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
        browser.tabs.sendMessage(tabs[0].id, {
            type:"getRequestingStatus"
        });
    });
});