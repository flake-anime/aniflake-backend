decrypt_link() {
	ajax_url='https://gogoplay.io/encrypt-ajax.php'
	secret_key='3235373436353338353932393338333936373634363632383739383333323838'
	iv='34323036393133333738303038313335'

	#get the id from the url
	video_id=$(printf '%s' "$1" | cut -d\? -f2 | cut -d\& -f1 | sed 's/id=//g')

	#construct ajax parameters
	ajax=$(printf '%s' "$video_id" | openssl enc -aes256 -K "$secret_key" -iv "$iv" -a)

	#send the request to the ajax url
	curl -s -H 'x-requested-with:XMLHttpRequest' "$ajax_url" -d "id=$ajax" -d "time=69420691337800813569" |
		sed -e 's/\].*/\]/' -e 's/\\//g' |
		grep -Eo 'https:\/\/[-a-zA-Z0-9@:%._\+~#=][a-zA-Z0-9][-a-zA-Z0-9@:%_\+.~#?&\/\/=]*'
}

dpage_link="$1"
decrypt_link "$dpage_link"