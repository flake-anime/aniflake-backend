import axios from "axios";
import cheerio from "cheerio";

class GoGoAnimeScraper {
    constructor(base_url) {
        this.base_url = base_url;
    }
    async search_anime(anime_name) {
        const search_result = await axios.get(this.base_url + "/search.html?keyword=" + anime_name);
        const $ = cheerio.load(search_result.data);
        const results = [];
        $("ul.items").find("li").each((i, elem) => {
            const anime_name = $(elem).find("a").text().trim();
            const anime_url = $(elem).find("a").attr("href");
            const anime_id = anime_url.split("/")[2];
            const anime_image = $(elem).find("img").attr("src");
            const result = {
                anime_name: anime_name,
                anime_url: anime_url,
                anime_id: anime_id,
                anime_image: anime_image
            }
            results.push(result);
        })
        return results;
    }
    async get_anime_detail(anime_id) {
        const anime_page = await axios.get(this.base_url + "/" + anime_id);
    }
}

export default GoGoAnimeScraper;