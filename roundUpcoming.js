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
        headless: true,
        // headless:false,
        // headless:process.env.NODE_ENV == 'production' ? true : false,
                // REMOVE THIS BEFORE PRODUCTION
        executablePath: process.env.NODE_ENV == 'production' ? '/usr/bin/google-chrome-stable' : puppeteer.executablePath()
    });
    try{
        let output = await (async () => {
            let outputRow = {
                title:'',
                scores:[],
                bestPlayers:[],
                goalkickers:[],
                date:'',
                location:'',
                round:'',
                link:''
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
            await page.waitForSelector('.sc-10c3c88-7');
            // await page.click('a.gdEmqr');
            // const link = await page.$('a.gdEmqr');
            // return link;
            isSite1Available = true;
        
            console.log("isSite",isSite1Available)
            if (isSite1Available) {
                console.log("in if")
                let set1 = await page.evaluate(() => {
                    
                    // let myLink = document.querySelector('a.gdEmqr')
                    let teamsData = Array.from(document.querySelectorAll('.sc-10c3c88-7'))
                    let round = document.querySelector('.sc-10c3c88-1').innerText
                    const scores = teamsData.map((row) => {
                        let _date = row.querySelector('.dpCSKv').innerText
                        // _date  ="07:40 PM, Thu, 28 Mar 24"
                        let _time = _date.split(",")[0].split(" ")[0]
                        let _restTime = _date.split(",")[1] + _date.split(",")[2]
                        let location = row.querySelector('.sc-10c3c88-15').innerText
                        let teamNames = Array.from(row.querySelectorAll('.sc-12j2xsj-3')).map((value) =>  value.innerText?.replace("Football Club",""))
                        // let secondValues = Array.from(row.querySelectorAll('.kLxiIC')).map((value) =>  value.innerText)
                        
                        return {
                            teamNames,
                            date:_restTime,
                            time:_time,
                            location
                            // points,
                            // secondValues
                        }

                    })
                    
                    return {
                        teams:scores,
                        round
                    }
                    
                   }
                );
                console.log("set1",set1)
               
                outputRow = set1;
             
            }

            await browser.close();
            // console.log(outputRow.data);
            // console.log(outputRow.heading)
            return outputRow
        })();
    
        console.log("OUTPUT",output)
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
    return output
}
async function scrapUpcomingCompetitionData(url) {
    let filteredData = await processData(url);
    // const filteredData = await filterData(data)
    return filteredData[0]
}

export { scrapUpcomingCompetitionData }