import requests
from bs4 import BeautifulSoup
import json
import os
from time import sleep
from datetime import datetime

OUTPUT_FILE = "./data/netflix_help_data.json"
LAST_RUN_FILE = "./data/last_run.json"

IMPORTANT_ARTICLES = [
    # Account & Access
    "https://help.netflix.com/en/node/33335",
    "https://help.netflix.com/en/node/470",
    "https://help.netflix.com/en/node/13243",
    "https://help.netflix.com/en/node/129831",
    "https://help.netflix.com/en/node/24926",
    "https://help.netflix.com/en/node/62990",

    # Playback & Quality
    "https://help.netflix.com/en/node/13444",
    "https://help.netflix.com/en/node/230",
    "https://help.netflix.com/en/node/1887",
    "https://help.netflix.com/en/node/104515",
    "https://help.netflix.com/en/node/116472",

    # General Info
    "https://help.netflix.com/en/node/412",
    "https://help.netflix.com/en/node/100639",
    "https://help.netflix.com/en/node/321880164349028",

    # Error Codes
    "https://help.netflix.com/en/node/14424",   # NW-2-5
    "https://help.netflix.com/en/node/12232",   # UI-800-3
    "https://help.netflix.com/en/node/14423",   # UI-113
    "https://help.netflix.com/en/node/12888",   # TVP-805
    "https://help.netflix.com/en/node/59985",   # TVQ-PB-101
    "https://help.netflix.com/en/node/45117",   # Error 113

    # Playback Display Issues
    "https://help.netflix.com/en/node/11634",
    "https://help.netflix.com/en/node/95",
    "https://help.netflix.com/en/node/13811",
    "https://help.netflix.com/en/node/47922",
    "https://help.netflix.com/en/node/25892",

    # Subtitles
    "https://help.netflix.com/en/node/23439",
    "https://help.netflix.com/en/node/116806"
]

def get_last_run_date():
    if os.path.exists(LAST_RUN_FILE):
        with open(LAST_RUN_FILE, "r") as f:
            data = json.load(f)
            return datetime.strptime(data["last_run"], "%Y-%m-%d")
    return None

def update_last_run_date():
    with open(LAST_RUN_FILE, "w") as f:
        json.dump({"last_run": datetime.today().strftime("%Y-%m-%d")}, f)

def scrape_netflix_help(url):
    try:
        response = requests.get(url, timeout=5)
        if response.status_code != 200:
            return None
        soup = BeautifulSoup(response.content, 'html.parser')

        title_tag = soup.find('h1', class_='kb-title')
        if not title_tag:
            return None

        title = title_tag.get_text(strip=True)
        content_blocks = []

        for tag in soup.select("p, li"):
            text = tag.get_text(strip=True)
            if text and text not in content_blocks:
                content_blocks.append(text)

        return {
            "url": url,
            "title": title,
            "content": content_blocks
        }
    except Exception as e:
        print(f"Failed to process {url}: {e}")
        return None

def main():
    last_run = get_last_run_date()
    today = datetime.today()

    if last_run and (today - last_run).days < 7:
        print(f"Script already run on {last_run.date()}, skipping this week's run.")
        return

    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    all_articles = []

    for url in IMPORTANT_ARTICLES:
        print(f"Scraping {url}")
        result = scrape_netflix_help(url)
        if result:
            all_articles.append(result)
            print(f"✓ Saved: {result['title']}")
        else:
            print("✗ Skipped")
        sleep(0.5)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(all_articles, f, indent=2, ensure_ascii=False)

    update_last_run_date()
    print("✅ Run complete. Last run date updated.")

if __name__ == "__main__":
    main()
