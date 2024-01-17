import express from 'express'
import { scrapeData } from './scrapData.js'
import { scrapeFixtureData } from './fixture.js'
import { scrapeStatisticsData } from './statistics.js'
import cors from 'cors'
import { scrapeFixtureDataNew } from './fixtureNew.js'
const app = express()

app.use(express.json())
app.use(
    cors({
      origin: [
        'http://localhost:3000','http://sweet-sawine-61bb78.netlify.app','https://sweet-sawine-61bb78.netlify.app'
      ]})
)
      
const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})

app.get('/', (req, res) => {
    res.send('Welcome to the server.')
})

app.post('/ladder', async(req, res) => {
    try{
        const url =req.body.url
        const output = await scrapeData(url)
        res.send({ status:'success',message:"Data scraped successfully",data:output})
    }catch(e){
        console.log(e)
        res.status(500).send({ status:'failure',message:"Something went wrong"})
    }
})

app.post('/fixture', async(req, res) => {
  try{
      const url =req.body.url
      const output = await scrapeFixtureData(url)
      const link = output.link;
      const output1 = await scrapeFixtureDataNew(link)
      res.send({ status:'success',message:"Data scraped successfully",data:output1})
  }catch(e){
      console.log(e)
      res.status(500).send({ status:'failure',message:"Something went wrong"})
  }
})

app.post('/statistics', async(req, res) => {
  try{
      const url =req.body.url
      const output = await scrapeStatisticsData(url)
      res.send({ status:'success',message:"Data scraped successfully",data:output})
  }catch(e){
      console.log(e)
      res.status(500).send({ status:'failure',message:"Something went wrong"})
  }
})


