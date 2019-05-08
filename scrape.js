const puppeteer = require('puppeteer');
const url = 'https://halifaxstanfield.ca/flight-information/departures/';
const $ = require('cheerio');
const fs = require('fs');
const YHZDestinations = {
    "Cities": []
}

const uniqueSet = new Set();
puppeteer.launch().then(async browser => {
    const page = await browser.newPage();
    await page.goto(url);
    let html = await page.content();
    await $('.location > span',html).each(function(i, elem) {
        if(uniqueSet.has($(this).text()))return true;
        else if( ($(this).text())=="")return true;
         uniqueSet.add($(this).text())   
     });
 
    YHZDestinations.Cities = await [...uniqueSet].sort();
            
    await fs.writeFile('YHZDestinations.json', JSON.stringify(YHZDestinations), function(err){
        if (err) throw err;
        console.log("Successfully Written to File.");
    });
    await browser.close();
});