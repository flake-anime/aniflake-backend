const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

class AnicliWrapper {
    async get_qualities(dpage_url) {
        let qualities
        qualities = await exec("sh anicli/get_video_qualities.sh " + dpage_url);
        qualities = qualities.stdout.split("\n");
        return qualities;
    }
    async decrypt_link(dpage_url) {
        let links
        links = await exec("sh anicli/decrypt_link.sh " + dpage_url);
        links = links.stdout.split("\n");
        return links;
    }
    async total_episodes(anime_id) {
        let total_episodes
        total_episodes = await exec("sh anicli/total_episodes.sh " + anime_id);
        total_episodes = total_episodes.stdout.replace("\n", "");
        return total_episodes;
    }    
}

(async function() {
    const anicli = new AnicliWrapper();
    const anime_id = "fantasy-bishoujo-juniku-ojisan-to"
    const total_episodes = await anicli.total_episodes(anime_id);
    console.log(total_episodes);
})();
