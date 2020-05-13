const help= require("./jobs.js");
const puppeteer =require('puppeteer');
let fs = require("fs");
(async function(){
    try{
      await help.jobs();
       //console.log(jobs)
       let data=await fs.promises.readFile("metadata.json")
       let obj=JSON.parse(data)
       console.log(obj)
       let credentials=await fs.promises.readFile("credentials.json")
       let { id, pass }=JSON.parse(credentials)
       //console.log(id)
       let browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ["--start-maximized", "--disable-notifications"]
      });
      let tabs = await browser.pages();
    let tab = tabs[0];
    
    await tab.goto("https://www.facebook.com/", { waitUntil: "networkidle2" });
    await tab.waitForSelector("input[type=email]");
    await tab.type("input[type=email]", id, { delay: 50 });
    await tab.type("input[type=password]", pass, { delay: 50 });
    await Promise.all([
        tab.click(".login_form_login_button"), tab.waitForNavigation({
          waitUntil: "networkidle2"
        })
      ])
   
    let len=obj.Jobs.length
   
    
   for(i=0;i<len;i++){
    await tab.waitForSelector(
        `[aria-label="What's on your mind, Ankur?"]`
      );
    await tab.click(`[aria-label="What's on your mind, Ankur?"]`);
    await tab.keyboard.type(obj.Jobs[i].Title+"  ",{ delay: 50 })
    await tab.keyboard.type(obj.Jobs[i].url,{ delay: 50 })
    await tab.click("._1mf7._4r1q._4jy0._4jy3._4jy1._51sy.selected._42ft");
       

    }
    //await tab.close();
}

    catch(err){
      console.log(err)
    }
})()

