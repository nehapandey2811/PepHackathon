// MODULES REQUIRED
const puppy = require("puppeteer");
const fs = require('fs')

// FB CREDENTIALS
const id = "cogebe2299@zcai77.com";  // Temporary mail ID.
const pass = "*****";  	             // Didn't upload here because of security reasons.

async function main() {

    // AUTOMATED BROWSER
    let browser = await puppy.launch({
        headless: false,
        defaultViewport: false,
    });
    let pages = await browser.pages();

    // CURRENT TAB
    let tab = pages[0];

    // DOWNLOADING IMAGES
    await tab.goto("https://unsplash.com/images/feelings/inspirational");
    await tab.waitForTimeout(10000);

    await tab.waitForSelector("._2UpQX")
    let description_of_image = await tab.$eval("._2UpQX",     // Description of the image will be stored
        element => element.alt)                               // to find relevant caption.

    await tab._client.send('Page.setDownloadBehavior',        // For downloading image in current directory.
        { behavior: 'allow', downloadPath: __dirname });

    let selector_of_images = await tab.$$(".Apljk", { visible: true });
    await selector_of_images[0].click()                       // Clicking on an image to open it.
    await tab.waitForTimeout(2000);

    await tab.waitForSelector("._2Aga-", { visible: true })
    await tab.click("._2Aga-")                                // Clicking on download button.

    await tab.waitForTimeout(10000);                          // Waiting for image to download.

    // OPENING NEW TAB TO FIND CAPTION
    tab = await browser.newPage();
    await tab.goto("https://www.brainyquote.com/topics/search-quotes");

    await tab.waitForSelector("#bq-search-input", { visible: true })
    await tab.type("#bq-search-input", description_of_image); // Finding relevant captions using 
    await tab.keyboard.press("Enter");                        // the description of the image.

    await tab.waitForSelector(".clearfix a")                  // Selecting a caption.
    let link_of_caption = await tab.$eval(".clearfix a",
        element => element.href)
    await tab.goto(link_of_caption);

    await tab.waitForSelector(".bq_fq.bq_fq_lrg.qt-fnt.bq-smpl-qt p")
    let caption = await tab.$eval(".bq_fq.bq_fq_lrg.qt-fnt.bq-smpl-qt p", // Storing the caption.
        element => element.innerHTML)
    await tab.waitForTimeout(5000);

    // OPENING NEW TAB TO UPLOAD IMAGE WITH CAPTION ON FB
    tab = await browser.newPage();
    await tab.goto("https://m.facebook.com/");
    await tab.type("._56bg._4u9z._5ruq._8qtn", id);
    await tab.type("._56bg._4u9z._27z2._8qtm", pass);

    await tab.click("._54k8._52jh._56bs._56b_._28lf._9cow._56bw._56bu"); // Login button.
    await tab.waitForNavigation({ waitUntil: "networkidle2" });

    await tab.click("._54k8._56bs._26vk._56b_._56bw._56bt");             // Do not remember password.
    await tab.waitForNavigation({ waitUntil: "networkidle2" });

    let posting_button = await tab.$$("._5xu4", { visible: true });
    await posting_button[1].click();                                     // New post button.

    const dir = 'C:/Users/NEHA PANDEY/Desktop/WebD Pep/Hackathon'
    const files = fs.readdirSync(dir)
    let image_name = files[0]                                            // Name of the image downloaded.
    await tab.waitForTimeout(2000);

    await tab.waitForSelector('input[type="file"]')
    const input = await tab.$('input[type="file"]')
    await input.uploadFile(`C:/Users/NEHA PANDEY/Desktop/WebD Pep/Hackathon/` + image_name) // Uploading image.

    await tab.waitForSelector(".composerInput.mentions-input", { visible: true });
    await tab.type(".composerInput.mentions-input", caption);                               // Writing caption.

    await tab.waitForTimeout(10000);    // Waiting for image to upload before posting.
    let listsubmit = await tab.$$('button[data-sigil="touchable submit_composer"]:not([disabled])', { visible: true });
    await listsubmit[0].click();        // Posted.
}
main();
