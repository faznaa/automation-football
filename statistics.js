import fs from "fs";
import { parse } from "csv-parse";
import puppeteer from 'puppeteer';
import { generateCsv } from './generateCsv.js';
import { configDotenv } from "dotenv";
configDotenv();

const noUrl = '#VALUE!';

async function getSearchData(siteUrl) {
    console.log("FIXTURE")
    const browser = await puppeteer.launch({
        args:[
            '--no-sandbox',
            '--disable-setuid-sandbox',
            "--single-process",
            "--no-zygote"
        ],
        // headless: true,
        // REMOVE THIS BEFORE PRODUCTION
        // headless:process.env.NODE_ENV == 'production' ? true : false,
        headless:true,
        executablePath: process.env.NODE_ENV == 'production' ? '/usr/bin/google-chrome-stable' : puppeteer.executablePath()
    });
    try{
        let output = await (async () => {
            let outputRow = {
                data:[],
                date:'',
                round:''
            }
            
            
            const page = await browser.newPage();
            // REMOVE THIS BEFORE PRODUCTION
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36');
            
            // Set screen size
            await page.setViewport({ width: 1080, height: 1024 });
    
            // Navigate the page to a URL
            // await page.goto(`https://www.similarweb.com/website/${siteUrl}/#overview`);
            await page.goto(`${siteUrl}?sort=GOAL_COUNT:DESC`,{timeout: 60000, waitUntil: 'domcontentloaded'})
            
            // await page.goto(siteUrl)
            // await page.waitForSelector('.app-header__container .app-search__input');
    
            // await page.type('.app-header__container .app-search__input', siteUrl);
            // await page.type('.app-header__container .app-search__input', Keyboard.press('Enter'));
    
            let isSite1Available = false
            // console.log('Current page content:', await page.content());
            await page.waitForSelector('.sc-1y2ivwy-5');
            // await page.click('button.lmzPKO');
            isSite1Available = true;
        
            console.log("isSite",isSite1Available)
            if (isSite1Available) {
                console.log("in if")
                let set1 = await page.evaluate(() => {
                    let head =[]
                    let date = ""
                    let round = ""
                    // let li = document.querySelectorAll(".sc-10c3c88-4")
                    let divs =document.querySelectorAll('.habRqr')
                    // let myDate = document.querySelector('.emDkPM')
                    // let myRound = document.querySelector('.fLyUTG')

                    // round = myRound.innerText
                    // date = myDate.innerText
                    // head.push(divs.length)
                    for (let i=1; i<divs.length;i++) {
                        elem = divs[i]
                        let playersList = {
                            rank:1,
                            player:'',
                            team:'',
                            gp:'',
                            g:'',
                            bp:'',
                        }
                        let players = Array.from(elem.querySelectorAll('.lkXaJb'))
                        // playersList.player = elem.innerText
                        playersList.rank = players[0].innerText
                        playersList.player = players[1].innerText
                        playersList.team = players[2].innerText?.replace("Football Club","")?.replace("Reserves","")
                        playersList.gp = players[3].innerText
                        playersList.g = players[4].innerText
                        playersList.bp = players[5].innerText
                        head.push(playersList)
                    }
                 
                    return { head, date, round };
                   }
                );
                console.log("set1",set1)
                outputRow.data = set1.head;
                outputRow.date = set1.date;
                outputRow.round = set1.round;
                // outputRow.data = set1.texts;
                // outputRow.tr = set1.fullData;
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
async function scrapeStatisticsData(url) {
    let filteredData = await processData(url);
    // const filteredData = await filterData(data)
    console.log(filteredData)
    return filteredData[0]
}

export { scrapeStatisticsData }