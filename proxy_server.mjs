import express from "express"
import cors from "cors"
import stream from "stream"
import got from "got"
import AnicliWrapper from "./anicli_wrapper.mjs"
import path, { dirname } from 'path';
import { Transform } from "stream"
import { fileURLToPath } from "url"

const port = process.env.PORT || 3000
const app = express()
app.use(cors())

const anicli = new AnicliWrapper()

app.get('/player', function(req, res) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    res.sendFile(path.join(__dirname, '/player.html'));
});

app.get('/get_streaming_links', async (req, res) => {
    const anime_id = req.query.anime_id
    const episode_number = req.query.eps_number || 1
    if(anime_id == undefined) {
        res.send("Error: anime_id is undefined")
        return
    }
    const dpage_url = await anicli.get_dpage_link(anime_id, episode_number)
    const links = await anicli.decrypt_link(dpage_url)
    const data = {
        links: links,
        dpage_url: dpage_url
    }
    res.send(data)
})

app.get("/stream", (req, res) => {
    const url = req.query.url
    const referer = req.query.referer

    res.setHeader('Content-Type', 'video/mp4');
    got.stream(url, {
        headers: {
            "referer": referer,
        }
    }).pipe(res);
})

app.listen(port, () => {
    console.log(`Proxy server running on port ${port}`)
})