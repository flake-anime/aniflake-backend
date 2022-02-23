import requests
import subprocess

def _make_loader(progress, total, message):
    loader_length = 30
    progress_unit = "█"

    # Calculating extra information
    progress_percentage = round((progress / total) * 100, 2)

    # Creating progress bar
    progress_length = int(( progress / total ) * loader_length) + 1
    space_length = loader_length - progress_length
    inner_loader = ""
    for _ in range(0, progress_length):
        inner_loader += progress_unit
    
    for _ in range(0, space_length):
        inner_loader += " "
    
    # Putting everything together
    progress_bar = f"[*] {message} [{inner_loader}] {progress_percentage}% {progress}/{total}"
    return progress_bar

def get_quality(dpage_url):
    """
    Get quality from download page
    """
    qualities = subprocess.run(
        ["sh", "anicli.sh", dpage_url], 
        capture_output = True
    )
    qualities = qualities.stdout.decode("utf-8").split("\n")
    return qualities



def download_episode(download_name, url, referer):
    session = requests.Session()
    session.headers.update({'referer': referer})  

    print("[*] Connecting ...")
    file = open(download_name, 'wb')
    response = session.get(url, stream=True)

    print("[+] Connected")
    file_size = int(response.headers["Content-Length"])
    downloaded_chunk_size = 0
    for chunk in response.iter_content(chunk_size=255): 
        if chunk:
            file.write(chunk)

            downloaded_chunk_size += len(chunk)
            progress_bar = _make_loader(
                progress = downloaded_chunk_size,
                total = file_size,
                message = "Downloading..."
            )
            print(progress_bar, end="\r")
    
    file.close()
    print("[+] Downloaded")


dpage_url = "https://gogoplay.io/download?id=MTgxMTk4&typesub=Gogoanime-SUB&title=Kenja+no+Deshi+wo+Nanoru+Kenja+Episode+7"
# qualities = get_quality(
#     dpage_url = dpage_url
# )
# _360p_url = qualities[0]

download_episode(
    download_name = "episode.mp4",
    url = "https://vidstreamingcdn.com/cdn39/0d543bf02da287fef64fe8cb74d61071/EP.7.v0.1645544642.1080p.mp4?mac=cAhLMVmiyD%2FGtYIXyg4VZXbdhoqQGc%2BiOvF5ItrRCzE%3D&vip=202.142.79.138&expiry=1645617089765",
    referer = dpage_url
)