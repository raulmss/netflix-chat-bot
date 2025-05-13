import json
import re

def clean_text(text):
    # Remove extra whitespace, newlines, and special characters
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def load_scraped_data(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: Scraped data file not found at {file_path}")
        return []

def process_data(scraped_data):
    processed_articles = []
    for article in scraped_data:
        url = article['url']
        title = article['title']
        cleaned_content_blocks = [clean_text(block) for block in article['content'] if block]
        full_content = " ".join(cleaned_content_blocks)  # Join with space instead of newline
        processed_articles.append({'url': url, 'title': title, 'content': full_content})
    return processed_articles

def chunk_data(processed_articles, chunk_size=500, overlap=100):
    chunks = []
    for article in processed_articles:
        url = article['url']
        title = article['title']
        content = article['content']
        for i in range(0, len(content), chunk_size - overlap):
            chunk = content[i:i + chunk_size]
            chunks.append({'url': url, 'title': title, 'chunk': chunk})
    return chunks

def save_processed_data(data, output_file):
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    print(f"Processed data saved to {output_file}")

if __name__ == "__main__":
    input_file = './data/netflix_help_data.json'
    output_file = './data/netflix_help_processed.json'

    scraped_data = load_scraped_data(input_file)
    if scraped_data:
        processed_data = process_data(scraped_data)
        chunked_data = chunk_data(processed_data)
        save_processed_data(chunked_data, output_file)
    else:
        print("No scraped data found. Run scraper.py first.")
