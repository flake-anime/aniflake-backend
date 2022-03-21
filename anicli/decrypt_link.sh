decrypt_link() {
	secret_key='3235373136353338353232393338333936313634363632323738383333323838'
	iv='31323835363732393835323338333933'
	ajax_url="https://gogoplay4.com/encrypt-ajax.php"
	crypto_data=$(curl -s "$1" | sed -nE 's/.*data-value="([^"]*)".*/\1/p')
	id=$(printf '%s' "$crypto_data" | base64 -d | openssl enc -d -aes256 -K "$secret_key" -iv "$iv" | cut -d '&' -f1)

	#encrypt and create the final ajax
	ajax=$(printf "%s\010\016\003\010\t\003\004\t" "$id" | openssl enc -aes256 -K "$secret_key" -iv "$iv" -a)

	#send request and get the data(most lamest way)
	data=$(curl -s -H "X-Requested-With:XMLHttpRequest" "$ajax_url" -d "id=$ajax" | sed -e 's/{"data":"//' -e 's/"}/\n/' -e 's/\\//g')
	
	#decrypt the data to get final links
	printf '%s' "$data" | base64 -d | openssl enc -d -aes256 -K "$secret_key" -iv "$iv" | sed -e 's/\].*/\]/' -e 's/\\//g' |
		grep -Eo 'https:\/\/[-a-zA-Z0-9@:%._\+~#=][a-zA-Z0-9][-a-zA-Z0-9@:%_\+.~#?&\/\/=]*'
}

dpage_link="$1"
decrypt_link "$dpage_link"