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
    res.send(links)
})

app.get("/stream", (req, res) => {
    const url = "https://vidstreamingcdn.com/cdn39/0d543bf02da287fef64fe8cb74d61071/EP.1.v1.1641940502.360p.mp4?mac=pM35Xy%2FLFSY7NvOKdn6mM0fKkRLbKi3gaWogUHQlft0%3D&vip=202.142.79.138&expiry=1645636407356"
    res.setHeader('Content-Type', 'video/mp4');
    got.stream(url, {
        headers: {
            "referer": "https://gogoplay.io/download?id=MTgxMTk4&typesub=Gogoanime-SUB&title=Kenja+no+Deshi+wo+Nanoru+Kenja+Episode+7",
        }
    }).pipe(res);
})

app.listen(port, () => {
    console.log(`Proxy server running on port ${port}`)
})