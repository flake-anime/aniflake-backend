const { link } = require('fs');
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
        links = await exec("sh anicli/decrypt_link.sh \"" + dpage_url + "\"");
        links = links.stdout.split("\n");
        links.pop()
        
        let filtered_link = []
        links.forEach(link => {
            filtered_link.push(link.replace("\n", ""))
        })

        return filtered_link;
    }
    async total_episodes(anime_id) {
        let total_episodes
        total_episodes = await exec("sh anicli/total_episodes.sh " + anime_id);
        total_episodes = total_episodes.stdout.replace("\n", "");
        return total_episodes;
    }
    async get_dpage_link(anime_id, episode_number) {
        let dpage_link
        dpage_link = await exec("sh anicli/get_dpage_link.sh " + anime_id + " " + episode_number);
        dpage_link = dpage_link.stdout.replace("\n", "");
        return dpage_link;
    } 
}

module.exports = AnicliWrapper;