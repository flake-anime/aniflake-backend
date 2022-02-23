get_dpage_link() {
	# get the download page url
	anime_id="$1"
	ep_no="$2"
	# credits to fork: https://github.com/Dink4n/ani-cli for the fix
	anime_page=$(curl -s "$base_url/$anime_id-$ep_no")
	echo '%s' "$anime_page" | grep -q '404' && anime_page=$(curl -s "$base_url/$anime_id-episode-$ep_no")
	echo '%s' "$anime_page" |
		sed -n -E 's/^[[:space:]]*<a href="#" rel="100" data-video="([^"]*)".*/\1/p' |
		sed 's/^/https:/g'
}

# gogoanime likes to change domains but keep the olds as redirects
base_url=$(curl -s -L -o /dev/null -w "%{url_effective}\n" https://gogoanime.cm)
anime_id="$1"
ep_no="$2"
get_dpage_link "$anime_id" "$ep_no"