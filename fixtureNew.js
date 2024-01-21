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
            await page.waitForSelector('.sc-1swl5w-21');
            // await page.click('a.gdEmqr');
            // const link = await page.$('a.gdEmqr');
            // return link;
            isSite1Available = true;
        
            console.log("isSite",isSite1Available)
            if (isSite1Available) {
                console.log("in if")
                let set1 = await page.evaluate(() => {
                    
                    let myLink = document.querySelector('a.gdEmqr')
                    let scoreTable = Array.from(document.querySelectorAll('tr.bGvXXJ'))
                    const scores = scoreTable.map((row) => {
                        let teamName = row.querySelector('th').innerText
                        let points = Array.from(row.querySelectorAll('.GkvRV')).map((value) =>  value.innerText).slice(1)
                        let secondValues = Array.from(row.querySelectorAll('.kLxiIC')).map((value) =>  value.innerText)
                        return {
                            teamName,
                            points,
                            secondValues
                        }

                    })
                    const nullPlayers = 'No best players have been selected'

                    let playData =document.querySelectorAll('.sc-1swl5w-17')[0]
                    playData = Array.from(playData.querySelectorAll('span.sc-jEACwC'))
                    // let date = 'h'
                    // let place = 'h'
                    // let round = 'h'
                    let date = playData[0].innerText
                    let place = playData[1].innerText
                    let round = playData[2].innerText

                    let playersInfo = Array.from(document.querySelectorAll('.sc-1swl5w-22'))
                    let bestPlayersTeam1 = playersInfo[0].querySelector('.sc-c5jfdg-2').innerText?.split(',')
                    let bestPlayersTeam2 = playersInfo[1].querySelector('.sc-c5jfdg-2').innerText?.split(',')
                    let bestPlayersTeam1Arr = bestPlayersTeam1[0] == nullPlayers ? [] : bestPlayersTeam1
                    let bestPlayersTeam2Arr = bestPlayersTeam2[0] == nullPlayers ? [] : bestPlayersTeam2
                    let playerStatisticTeam1 = playersInfo[2]?.querySelectorAll('tr')
                    let playerStatisticTeam2 = playersInfo[3]?.querySelectorAll('tr')
                    let _playerStatisticTeam1 = Array.from(playerStatisticTeam1).map((row) => {
                        let playerData =Array.from(row.querySelectorAll('td'))
                        if(!playerData[0]?.innerText) return null
                        return {
                            index:playerData[0]?.innerText,
                            player:playerData[1]?.innerText,
                            goal:playerData[2]?.innerText,
                        }
                    })
                    playerStatisticTeam1 = _playerStatisticTeam1.filter((value) => value?.goal != null)
                    playerStatisticTeam1.sort((a,b) => a.index - b.index)
                    const goalKeepersTeam1 = playerStatisticTeam1.filter((value) => value.goal != '0')
                    let _playerStatisticTeam2 = Array.from(playerStatisticTeam2).map((row) => {
                        let playerData =Array.from(row.querySelectorAll('td'))
                        if(!playerData[0]?.innerText) return null
                        return {
                            index:playerData[0]?.innerText,
                            player:playerData[1]?.innerText,
                            goal:playerData[2]?.innerText,
                        }
                    })
                    playerStatisticTeam2 = _playerStatisticTeam2.filter((value) => value?.goal != null)
                    playerStatisticTeam2.sort((a,b) => a.index - b.index)
                    const goalKeepersTeam2 =playerStatisticTeam2.filter((value) => value?.goal != '0')
                    goalKeepersTeam1.sort((a,b) => b.goal - a.goal)
                    goalKeepersTeam2.sort((a,b) => b.goal - a.goal)
                    return {
                        date,
                        place,
                        round,
                        playData:playData[0].innerText,
                        scores,
        
                        playersLength:playersInfo.length,
                        bestPlayers:{
                            team_1:bestPlayersTeam1Arr ,
                            team_2:bestPlayersTeam2Arr,
                            all:bestPlayersTeam1Arr.concat(bestPlayersTeam2Arr)
                        },
                        goalKeepers:{
                            team_1:goalKeepersTeam1,
                            team_2:goalKeepersTeam2,
                            all:goalKeepersTeam1.concat(goalKeepersTeam2),
                            text:{
                                team_1:goalKeepersTeam1
                            }
                        }

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
async function scrapeFixtureDataNew(url) {
    let filteredData = await processData(url);
    // const filteredData = await filterData(data)
    return filteredData[0]
}

export { scrapeFixtureDataNew }