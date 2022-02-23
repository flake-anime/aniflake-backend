const express = require("express")
const cors = require("cors")
const stream = require("stream")
const { Transform } = require("stream")
const AnicliWrapper = require("./anicli_wrapper")

const port = process.env.PORT || 3000
const app = express()

const anicli = new AnicliWrapper()

app.use(cors())

app.get('/get_streaming_links', async (req, res) => {
    const anime_id = req.query.anime_id
    const episode_number = req.query.eps_number || 1
    if(anime_id == undefined) {
        res.send("Error: anime_id is undefined")
        return
    }
    const dpage_url = await anicli.get_dpage_link(anime_id, episode_number)
    const links = await anicli.decrypt_link(dpage_url)
    res.send(links)
})

app.listen(port, () => {
    console.log(`Proxy server running on port ${port}`)
})