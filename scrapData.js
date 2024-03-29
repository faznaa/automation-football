import fs from "fs";
import { parse } from "csv-parse";
import puppeteer from 'puppeteer';
import { generateCsv } from './generateCsv.js';
import { configDotenv } from "dotenv";
configDotenv();

const noUrl = '#VALUE!';

async function getSearchData(siteUrl) {
    const browser = await puppeteer.launch({
        args:[
            '--no-sandbox',
            '--disable-setuid-sandbox',
            "--single-process",
            "--no-zygote"
        ],
        // headless: true,
        // REMOVE THIS BEFORE PRODUCTION
        headless:true,
        executablePath: process.env.NODE_ENV == 'production' ? '/usr/bin/google-chrome-stable' : puppeteer.executablePath()
    });
    try{
        let output = await (async () => {
            let outputRow = {
                tr:[],
                data:[],
                heading:[]
            }
            
            
            const page = await browser.newPage();
            // REMOVE THIS BEFORE PRODUCTION
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36');
            
            // Set screen size
            await page.setViewport({ width: 1080, height: 1024 });
    
            // Navigate the page to a URL
            // await page.goto(`https://www.similarweb.com/website/${siteUrl}/#overview`);
            await page.goto(siteUrl,{timeout: 60000, waitUntil: 'domcontentloaded'})
            
            // await page.goto(siteUrl)
            // await page.waitForSelector('.app-header__container .app-search__input');
    
            // await page.type('.app-header__container .app-search__input', siteUrl);
            // await page.type('.app-header__container .app-search__input', Keyboard.press('Enter'));
    
            let isSite1Available = false
            // console.log('Current page content:', await page.content());
            await page.waitForSelector('div');
            await page.click('button.lmzPKO');
            isSite1Available = true;
            console.log("site availabl tru")
        
            console.log("isSite",isSite1Available)
            if (isSite1Available) {
                console.log("in if")
                let set1 = await page.evaluate(() => {
                    let table = document.querySelectorAll("table")
                    let table_heading = table[0].querySelectorAll("th")
                    let table_body = table[0].querySelectorAll("td")
                    let head = [];
                    
                    for (let element of table_heading) {
                        head.push(element.textContent);
                    }
                    let table_heading_2 = table[1].querySelectorAll("th")
                    let table_body_2 = table[1].querySelectorAll("tr")
                    for (let element of table_heading_2) {
                            head.push(element.textContent);
                        
                    }
                    let fullData = {}
                    head.map((item,index)=>{
                        fullData[item] = []
                    })
                    let texts = [];
                    x=0
                    for (let element of table_body) {
                        if(x%2==0){
                            fullData[head[0]].push(element.textContent)
                        }
                        else{
                            fullData[head[1]].push(element.textContent)
                        }
                        x++
                    }
                    for (let element of table_body_2) {
                        a=2
                        let table_body_2_td = element.querySelectorAll("td")
                        if(table_body_2_td.length==0){
                            continue
                        }
                        for (let element_td of table_body_2_td) {
                                fullData[head[a]].push(element_td.textContent)
                                a++
                        }
                    }
    
                    // let texts = [];
                    // for (let element of elements) {
                    //     texts.push(element.textContent);
                    // }
                    return { head, texts, fullData};
                   }
                );
                console.log("set1",set1)
                outputRow.heading = set1.head;
                outputRow.data = set1.texts;
                outputRow.tr = set1.fullData;
            }
           
            await browser.close();
            // console.log(outputRow.data);
            // console.log(outputRow.heading)
            return outputRow
        })();
    
    
        return output;
    }catch(err) {
        console.log("err1",err)
        
    }finally{
        await browser.close();
    }
}

async function processData(url) {
    let inputData = [{
        'websiteUrl':url
    }]
    let outputData = [];
    for (let row of inputData) {
        if (row.websiteUrl == noUrl) {
            outputData.push({
                
            })
        } else {
            let siteUrl = row.websiteUrl;
            console.log(siteUrl);
            let output = await getSearchData(siteUrl)
            outputData.push(output);
        }
    }

    return outputData;
}
async function filterData(data) {
    const head = data[0].heading
    const input= data[0].tr
    const output = input['#'].map((value, index) => ({
        a: value,
        [head[1]]: input[head[1]][index],
        [head[2]]: input[head[2]][index],
        [head[3]]: input[head[3]][index],
        [head[4]]: input[head[4]][index],
        [head[5]]: input[head[5]][index],
        [head[6]]: input[head[6]][index],
        [head[7]]: input[head[7]][index],
        [head[8]]: input[head[8]][index],
        [head[9]]: input[head[9]][index],
        [head[10]]: input[head[10]][index],
        [head[11]]: input[head[11]][index],
      }));
    console.log(output)
    return output
}
async function scrapeData(url) {
    let data = await processData(url);
    const filteredData = await filterData(data)
    console.log(filteredData)
    return filteredData
}

export { scrapeData }