/**
 * Created by OUSSEYNDOU NDOUR on 26/06/2017.
 */


;(() => {
    var browser = self.browser || self.chrome;
    var chrome = browser;
    var notificationGeneratingPdfID = "progress_bar_notification";
    var notificationGeneratingPdfDoneSuccessID = "generate_done_success_notification";
    var notificationGeneratingPdfDoneFailledID = "generate_done_failled_notification";
    var notificationGeneratingPdfIntervalId = null;

    var animateNotification = (notificationGeneratingPdfID, notificationOptions) => {
        if(typeof browser.notifications.update !== "function")
        {
            return;
        }
        var progress = 0;
        clearInterval(notificationGeneratingPdfIntervalId);
        notificationGeneratingPdfIntervalId =  setInterval(() => {
            notificationOptions.progress = progress;
            browser.notifications.update(notificationGeneratingPdfID, notificationOptions);
            progress < 100 ? progress++ : (progress = 0);
        }, 10);
    };

    browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        chrome.pageAction.show(tabId);
    });

    browser.runtime.onMessage.addListener((message, sender) => {
        var notificationOptions = {};

        if (message && message.type === 'showProgressPar')
        {
            notificationOptions = {
                type: "progress",
                title:browser.i18n.getMessage("notificationProgressTitle"),
                message:browser.i18n.getMessage("notificationProgressMessage"),
                iconUrl:browser.extension.getURL("ico/loading.png"),
                progress:0
            };

            browser.notifications.create(
                notificationGeneratingPdfID,
                notificationOptions
            );

            animateNotification(notificationGeneratingPdfID, notificationOptions);
        }
        else if (message && message.type === 'taskDone')
        {
            var requestResult = message.requestResult;
            var downloadedFileName = requestResult.downloadedFileName;
            var downloadStartDate = requestResult.downloadStartDate;
            var downloadUrl = requestResult.downloadUrl;

            var notificationId;

            notificationOptions = {
                type: "progress"
            };

            if(requestResult.error)
            {
                notificationOptions.title = browser.i18n.getMessage("notificationGenerateFailledTitle");
                notificationOptions.message = browser.i18n.getMessage("notificationGenerateFailledMessage");
                notificationOptions.contextMessage = browser.i18n.getMessage("notificationGenerateFailledContextMessage");
                notificationOptions.iconUrl =  browser.extension.getURL("ico/error.png");
                notificationOptions.progress = 20;
                notificationId = notificationGeneratingPdfDoneFailledID;
                /*notificationOptions.buttons = [
                    {
                        title:browser.i18n.getMessage("retryButton")
                    }
                ];*/
            }
            else
            {
                notificationOptions.title = browser.i18n.getMessage("notificationGenerateSuccessTitle");
                notificationOptions.message = browser.i18n.getMessage("notificationGenerateSuccessMessage");
                notificationOptions.contextMessage = browser.i18n.getMessage("notificationGenerateSuccessContextMessage");
                notificationOptions.iconUrl =  browser.extension.getURL("ico/success.png");
                notificationOptions.progress = 100;
                notificationId = notificationGeneratingPdfDoneSuccessID;

                notificationOptions.buttons = [
                    {
                        title:browser.i18n.getMessage("openFileButton")
                    }
                ]
            }

            setTimeout(function () { //clear all notification before showing new
                clearInterval(notificationGeneratingPdfIntervalId);
                browser.notifications.clear(notificationGeneratingPdfID);
                browser.notifications.clear(notificationGeneratingPdfDoneSuccessID);
                browser.notifications.clear(notificationGeneratingPdfDoneFailledID);


                browser.notifications.create(
                    notificationId,
                    notificationOptions
                );
            }, 500);

            browser.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
                if(notificationId == notificationGeneratingPdfDoneFailledID)
                {

                }
                else
                {

                    browser.downloads.search({
                        startedAfter:downloadStartDate,
                        endedBefore:(new Date()).toISOString(),
                        orderBy:[
                            "-endTime"
                        ],
                        state:"complete"
                        //,limit:1
                    }, (downloadItems) => {
                        if (downloadItems.length > 0) {

                            browser.downloads.open(downloadItems[0].id);
                        }
                    });
                }
            });
        }
    });

})();
