import express from 'express'
import { scrapeData } from './scrapData.js'
import { scrapeFixtureData } from './fixture.js'
import { scrapeStatisticsData } from './statistics.js'
import cors from 'cors'
import { scrapeFixtureDataNew } from './fixtureNew.js'
import { generateBlogFinal } from './blog.js'
import dotenv from 'dotenv'
import { getLinks } from './getLinksFromPage.js'
const app = express()

dotenv.config()
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

      // const blog = generat
      res.send({ status:'success',message:"Data scraped successfully",data:output1})
  }catch(e){
      console.log(e)
      res.status(500).send({ status:'failure',message:"Something went wrong"})
  }
})



app.post('/blog',async(req, res) => {
    try{
      const url =req.body.url
      const prompt =req.body.prompt
      const output = await getLinks(url)
      const links = output.link;
   
      const blogs = []
      for (const link of links) {
        const output1 = await scrapeFixtureDataNew(link);
        const blog = await generateBlogFinal(output1,prompt);
        blogs.push(blog);
      }

      // const blog = generat
      res.send({ status:'success',message:"Blog generated successfully",blogs})

      // res.send({ status:'success',message:"Blog generated successfully",blogs:[blog,blog1]})
    } catch(e){
        console.log(e)
        res.status(500).send({ status:'failure',message:"Something went wrong"})
    }
})

app.post('/links',async(req, res) => {
  try{
    const url =req.body.url
    const output = await getLinks(url)
    const links = output.link;
    res.send({ status:'success',message:"Retrieved links successfully",data:links})
  } catch(e){
      console.log(e)
      res.status(500).send({ status:'failure',message:"Something went wrong"})
  }
})

app.post('/blog/single',async(req, res) => {
  try{
    const url =req.body.url
    const output1 = await scrapeFixtureDataNew(url);
    const blog = await generateBlogFinal(output1);
    res.send({ status:'success',message:"Retrieved links successfully",data:blog})
  } catch(e){
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


