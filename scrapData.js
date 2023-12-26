import fs from "fs";
import { parse } from "csv-parse";
import puppeteer from 'puppeteer';
import { generateCsv } from './generateCsv.js';
import { configDotenv } from "dotenv";
configDotenv();
const site1 = `https://www.similarweb.com/`;
const site2 = `https://website.grader.com/`;
const noUrl = '#VALUE!';

console.log("EXEC",process.env.PUPPETEER_EXECUTABLE_PATH)
async function getSearchData(siteUrl) {
    try{
        let output = await (async () => {
            let outputRow = {
                employee: '',
                hq: '',
                revenue: '',
                industry: '',
                bounceRate: '',
                avgVisitDur: '',
                age: '',
                websitetraffic: '',
                performance: '',
                seo: '',
                mobile: '',
                security: '',
                trafficPercentage:'',
                tr:[],
                data:[],
                heading:[]
            }
            // Launch the browser and open a new blank page
            // const browser = await puppeteer.launch({ headless: false, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
            // const browser = await puppeteer.launch({
            //     headless:false
            // })
            console.log(puppeteer.executablePath())
            // const browser = await puppeteer.launch({
            //     args:[
            //         '--no-sandbox',
            //         '--disable-setuid-sandbox',
            //         "--single-process",
            //         "--no-zygote"
            //     ],
            //     headless: false,
            //     executablePath: process.env.NODE_ENV == 'production' ? process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer.executablePath()
            // });
            const browser = await puppeteer.launch({
                // args:[
                //     '--no-sandbox',
                //     '--disable-setuid-sandbox',
                //     "--single-process",
                //     "--no-zygote"
                // ],
                headless: false,
                executablePath: process.env.NODE_ENV == 'production' ? '/usr/bin/google-chrome-stable' : puppeteer.executablePath()
            });
            const page = await browser.newPage();
    
            // Set screen size
            await page.setViewport({ width: 1080, height: 1024 });
    
            // Navigate the page to a URL
            // await page.goto(`https://www.similarweb.com/website/${siteUrl}/#overview`);
            await page.goto(siteUrl,{timeout: 10000, waitUntil: 'domcontentloaded'})
            
            // await page.goto(siteUrl)
            // await page.waitForSelector('.app-header__container .app-search__input');
    
            // await page.type('.app-header__container .app-search__input', siteUrl);
            // await page.type('.app-header__container .app-search__input', Keyboard.press('Enter'));
    
            let isSite1Available = true
            try {
                await page.waitForSelector('.sc-wpruo1-1');
                // await page.click('button.lmzPKO');
                isSite1Available = true;
                console.log("site availabl tru")
            } catch (err) { 
                throw new Error("Site not available",err)
            }
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
                // let sety = await page.evaluate(() => {
                //     let elements = document.querySelector('.app-parameter-change')
                //     let texts = [];
                //     for (let element of elements) {
                //         texts.push(element.textContent);
                //     }
                //     return texts;
                // });
                // let sety= await page.evaluate(() => {
                //     let elements = Array.from(document.querySelectorAll('.app-parameter-change'))
                //     let texts = [];
                //     for (let spanElement of elements) {
                //         const textContent = spanElement.textContent;
    
            // Extract the percentage value (e.g., "19.49%")
            // const percentageValue = textContent.match(/(\d+\.\d+)%/);
    
            // if (percentageValue) {
            //     const value = parseFloat(percentageValue[1]);
            //     const isNegative = spanElement.classList.contains('app-parameter-change--down');
    
            //     texts.push(isNegative ? -value : value)
            // } else {
            //     console.log('Percentage value not found');
            // }
                        
            //         };
            //         return texts
            //     })
            //     outputRow.trafficPercentage = sety[0];
            //     // console.log(set1);
            //     outputRow.employee = set1[2];
            //     outputRow.hq = set1[3];
            //     outputRow.revenue = set1[4];
            //     outputRow.industry = set1[5];
    
            //     await page.waitForSelector('.engagement-list__item-value')
            //     let set4 = await page.evaluate(() => {
            //         let elements = Array.from(document.querySelectorAll('.engagement-list__item-value'))
            //         let myElem = document.querySelectorAll('app-parameter-change--down')
            //         let texts = [];
            //         for (let element of elements) {
            //             texts.push(element.innerText);
            //         }
            //         return texts;
            //     });
    
            //     outputRow.bounceRate = set4[1];
            //     outputRow.avgVisitDur = set4[3];
    
            //     // await page.goto(`https://www.similarweb.com/website/${siteUrl}/#demographics`);
    
            //     await page.waitForSelector('.wa-demographics__age-data-label');
    
            //     let set2 = await page.evaluate(() => {
            //         let elements = Array.from(document.querySelectorAll('.wa-demographics__age-data-label'))
            //         let texts = [];
            //         for (let element of elements) {
            //             texts.push(element.innerHTML);
            //         }
            //         return texts;
            //     });
    
            //     if (set2[0] != '--' && set2[0].split('%').length) {
            //         let values = []
            //         for (let value of set2) {
            //             values.push(parseInt(value.split('%')[0], 10))
            //         }
    
            //         let age1 = values[0] + values[1];
            //         let age2 = values[2] + values[3];
            //         let age3 = values[4] + values[5];
    
            //         outputRow.age = Math.max(age1, age2, age3) == age1 ? '1' : Math.max(age2, age3) == age2 ? '2' : '3'
            //     }
            // }
    
            // await page.goto(`https://website.grader.com/tests/${siteUrl}`);
    
            // let isSite2Available = false
            // try {
            //     await page.waitForSelector('.score', {timeout: 60000});
            //     isSite2Available = true
            // } catch (err) { }
    
            // if (isSite2Available) {
    
            //     let set3 = await page.evaluate(() => {
            //         let elements = Array.from(document.querySelectorAll('.score'))
            //         let texts = [];
            //         for (let element of elements) {
            //             texts.push(element.innerText);
            //         }
            //         return texts;
            //     });
            //     // console.log(set3);
    
            //     outputRow.performance = set3[0].split('/')[0];
            //     outputRow.seo = set3[1].split('/')[0];
            //     outputRow.mobile = set3[2].split('/')[0];
            //     outputRow.security = set3[3].split('/')[0];
            // }
    
    
    
            await browser.close();
            // console.log(outputRow.data);
            // console.log(outputRow.heading)
            return outputRow
        })();
    
        return output;
    }catch(err) {
        console.log("err1",err)
    }
}

// let inputData = [];

async function parseCsv() {
    let promise = new Promise((resolve, reject) => {
        fs.createReadStream("./urlCsv.csv")
            .pipe(
                parse({
                    delimiter: ",",
                    columns: true,
                    ltrim: true,
                })
            )
            .on("data", function (row) {
                // This will push the object row into the array
                inputData.push(row);
            })
            .on("error", function (error) {
                console.log(error.message);
            })
            .on("end", function () {
                console.log('parse input done!');
                resolve();
            });
    });

    return promise;
}

async function processData(inputData) {
    // await parseCsv();

    let outputData = [];
    for (let row of inputData) {
        if (row.websiteUrl == noUrl) {
            // do empty csv row
            outputData.push({
                
            })
        } else {
            // let siteUrl = row.websiteUrl.split('/')[2];
            let siteUrl = row.websiteUrl;
            console.log(siteUrl);
            let output = await getSearchData(siteUrl)
            outputData.push(output);
        }
    }

    return outputData;
}
async function filterData(data) {
    // console.log(data[0])
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
async function scrapeData(inputData) {
    let data = await processData(inputData);
    const filteredData = await filterData(data)
    console.log(filteredData)
    return filteredData
    // await generateCsv(filteredData);
}

// scrapeData();

// getSearchData('www.pixelgen.com')
export { scrapeData }