# 📡 Netflix ChatBot Backend

This is the backend service for the Netflix ChatBot — an AI assistant designed to help users troubleshoot technical issues related to Netflix. It handles data scraping, embedding, and querying, and serves responses through a RESTful API built with FastAPI.

---

## ⚙️ Technologies Used

1. **Python 3.12** – Core language used for development.
2. **FastAPI** – High-performance web framework for APIs.
3. **Uvicorn** – ASGI server for running the FastAPI app.
4. **Pydantic** – For data validation and settings management.
5. **Sentence-Transformers** – For generating and querying semantic embeddings.
6. **Google Generative AI (Gemini API)** – To generate contextual responses.
7. **NumPy** – For vector math and similarity calculations.

---

## 📁 Data Folder Structure

After scraping and processing, the following files are generated under `/data`:

- `last_run.json`: Timestamp and metadata from the last scraping run.
- `netflix_help_data.json`: Raw HTML content from Netflix Help Center.
- `netflix_help_processed.json`: Cleaned and chunked version of the raw data.
- `netflix_help_embeddings.json`: Pre-computed sentence embeddings of the processed chunks.

---

## 🔍 Steps to Scrape and Process Data

1. **Run the scraper**  
   This will download Netflix support articles.

   ```bash
   python scraper.py
   ```

   Output: `data/netflix_help_data.json`

2. **Run the processor**  
   This chunks and embeds the scraped data.

   ```bash
   python processor.py
   ```

   Output: 
   - `data/netflix_help_processed.json`
   - `data/netflix_help_embeddings.json`

---

## 🚀 How to Run the Backend

### 1. Clone the repository

```bash
git clone https://github.com/raulmss/netflix-chat-bot.git
cd netflix-chat-bot/netflix_agent_backend
```

### 2. Create virtual environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Add your Gemini API key

Export you Google Gemini API Key:

```env
export GOOGLE_API_KEY=your_gemini_api_key
```

### 5. Start the server

```bash
uvicorn app:app --reload --host 0.0.0.0 --port 5000
```

Visit the API documentation at:  
[http://localhost:5000/docs](http://localhost:5000/docs)

---

## 🧾 License

This backend is intended for educational and personal use only.
