import express from "express"
import cors from "cors"
import got from "got"
import AnicliWrapper from "./engine/anicli_wrapper.mjs"
import path, { dirname } from 'path';
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

app.get('/get_streaming_sources', async (req, res) => {
    const anime_id = req.query.anime_id
    const eps_number = req.query.eps_number || 1
    if(anime_id == undefined) {
        res.send("Error: anime_id is undefined")
        return
    }
    const dpage_url = await anicli.get_dpage_link(anime_id, eps_number)
    const links = await anicli.decrypt_link(dpage_url)
    let sources = []
    links.forEach(link => {
        const quality_extrator_regex = /.(\d+)p.mp4/
        const quality = link.match(quality_extrator_regex)[1]
        const streaming_url = '/stream?url=' + encodeURIComponent(link) + '&referer=' + encodeURIComponent(dpage_url)
        sources.push({
            src: streaming_url,
            type: 'video/mp4',
            size: quality
        })
    })
    res.send(sources)
})

app.get("/stream", (req, res) => {
    const url = req.query.url
    const referer = req.query.referer
    res.setHeader('Content-Type', 'video/mp4');
    got.stream(url, { headers: { "referer": referer }}).pipe(res);
})

app.get("/search", async (req, res) => {
    const anime_name = req.query.anime_name
    if(anime_name == undefined) {
        res.send("Error: anime_name is undefined")
        return
    }
    const results = []
    const result_anime_ids = await anicli.search_anime(anime_name)
    const promises = result_anime_ids.map(async anime_id => {
        const total_episodes = await anicli.total_episodes(anime_id)
        const result = {
            anime_id: anime_id,
            total_episodes: total_episodes
        }
        results.push(result)
    });
    await Promise.all(promises)
    res.send(results)
})

app.listen(port, () => {
    console.log(`Proxy server running on port ${port}`)
})