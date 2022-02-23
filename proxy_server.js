const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

class AnicliWrapper {
    get_qualities(dpage_url) {
        qualities = await exec("sh anicli/get_video_qualities.sh " + dpage_url);
        qualities = qualities.stdout.split("\n");
        return qualities;
    }
    decrypt_link(dpage_url) {
        links = await exec("sh anicli/decrypt_link.sh " + dpage_url);
        links = links.stdout.split("\n");
        return links;
    }
}

async function get_qualities(dpage_url) {
    qualities = await exec("sh anicli/get_video_qualities.sh " + dpage_url);
    qualities = qualities.stdout.split("\n");
    return qualities;
}

async function decrypt_link(dpage_url) {
    links = await exec("sh anicli/decrypt_link.sh " + dpage_url);
    links = links.stdout.split("\n");
    return links;
}

(async function() {
    const dpage_url = "https://gogoplay.io/download?id=MTgxMTk4&typesub=Gogoanime-SUB&title=Kenja+no+Deshi+wo+Nanoru+Kenja+Episode+7";
    const links = await decrypt_link(dpage_url);
    console.log(links);
})();
