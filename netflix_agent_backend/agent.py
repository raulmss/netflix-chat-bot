import google.generativeai as genai
import json
import numpy as np
import os
from sentence_transformers import SentenceTransformer

# ✅ Set up Gemini API key
genai.configure(api_key="GEMINI_API_KEY")  # Replace with your real key

# ✅ Define the correct Gemini model
GEMINI_MODEL_NAME = "models/gemini-1.5-flash"

# ✅ Initialize embedding model
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

# ✅ Initialize global chat session
chat = None
sent_chunk_urls = set()


def list_available_models():
    try:
        print("Available Gemini models:")
        for m in genai.list_models():
            print(f"  {m.name}: {m.description}")
            print(f"    Supported methods: {m.supported_generation_methods}")
    except Exception as e:
        print(f"Error listing models: {e}")
        return []
    return genai.list_models()

def load_processed_data(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: Processed data file not found at {file_path}")
        return []

def generate_embeddings(data):
    embeddings = []
    for item in data:
        embedding = embedding_model.encode(item['chunk'])
        embeddings.append({
            'url': item['url'],
            'title': item['title'],
            'chunk': item['chunk'],
            'embedding': embedding.tolist()
        })
    return embeddings

def save_embeddings(embeddings, output_file):
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(embeddings, f, indent=4, ensure_ascii=False)
    print(f"Embeddings saved to {output_file}")

def load_embeddings(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            for item in data:
                item['embedding'] = np.array(item['embedding'])
            return data
    except FileNotFoundError:
        print(f"Error: Embeddings file not found at {file_path}")
        return []

def find_relevant_chunks(query, embeddings_data, top_n=3):
    query_embedding = embedding_model.encode(query)
    similarities = []
    for item in embeddings_data:
        a = item['embedding']
        b = query_embedding
        similarity = np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-8)
        similarities.append((similarity, item))
    similarities.sort(key=lambda x: x[0], reverse=True)
    return [item[1] for item in similarities[:top_n]]


def start_chat_session(context_text):
    model = genai.GenerativeModel(GEMINI_MODEL_NAME)
    chat = model.start_chat()

    chat.send_message(f"""You are a helpful Netflix Help Center assistant.

Use only the information below to help the user.

When the user asks a question:
- First, ask **follow-up questions** to clarify their situation if needed.
- Let user know at all times that you're there to help him/her solve the problem.
- Then, **guide them through troubleshooting steps** clearly and one at a time. Keep the order found in the documentation. That is important to make the solution work.
- When answering the question, explain which scenario of which article will be used to provide the question.
Here is your Netflix Help Center reference:
---
{context_text}
---""")
    # Priming prompt as user message (because Flash doesn't support system role)

    return chat


def ask_agent(query, embeddings_data):
    global chat, sent_chunk_urls

    # Get only the top 2 relevant chunks
    top_chunks = find_relevant_chunks(query, embeddings_data, top_n=2)

    # Filter out chunks that have already been sent
    new_chunks = [chunk for chunk in top_chunks if chunk['url'] not in sent_chunk_urls]

    # Update the tracker
    for chunk in new_chunks:
        sent_chunk_urls.add(chunk['url'])

    # Convert new chunks to context text
    context_text = "\n\n".join([
        f"Title: {chunk['title']}\nURL: {chunk['url']}\nContent: {chunk['chunk']}"
        for chunk in new_chunks
    ])

    try:
        # Start chat session if needed
        if chat is None:
            available_models = [m.name for m in genai.list_models()]
            if GEMINI_MODEL_NAME not in available_models:
                print(f"Error: '{GEMINI_MODEL_NAME}' is not available.")
                return "I'm sorry, the requested model is not currently available."

            model = genai.GenerativeModel(GEMINI_MODEL_NAME)
            chat = model.start_chat()
            print("✅ Chat session started.\n")

            chat.send_message("""You are a helpful Netflix Help Center assistant.
Still abide by the principle initially given for when the user asks a question.
Remember to give one step at time, following the order given by the article. Guide user through each step.
Use only the knowledge base content I provide to assist users. Ask insightful follow-up questions when the situation is unclear. Be friendly, structured, and always explain the reasoning behind each step. If you recognize a known scenario, cite the article used. If no solution fits, suggest visiting https://help.netflix.com/en/ or contacting support.
""")

        # Inject only new context (if any)
        if new_chunks:
            chat.send_message(f"""Here is updated Netflix Help Center info that may help:
---
{context_text}
---""")

        # Send the user's actual question
        response = chat.send_message(query)
        return response.text

    except Exception as e:
        return f"An error occurred while communicating with the Gemini API: {e}"


if __name__ == "__main__":

    processed_file = './data/netflix_help_processed.json'
    embeddings_file = './data/netflix_help_embeddings.json'
    processed_data = load_processed_data(processed_file)

    if not os.path.exists(embeddings_file) and processed_data:
        embeddings = generate_embeddings(processed_data)
        save_embeddings(embeddings, embeddings_file)

    embeddings_data = load_embeddings(embeddings_file)

    print("Type 'reset' to start a new conversation.\n")
    while True:
        user_question = input("Ask Netflix Help (type 'exit' to quit): ")
        if user_question.lower() == 'exit':
            break
        elif user_question.lower() == 'reset':
            chat = None
            print("🔄 Chat session reset.\n")
            continue

        if embeddings_data:
            relevant_chunks = find_relevant_chunks(user_question, embeddings_data)
            if relevant_chunks:
                answer = ask_agent(user_question, relevant_chunks)
                print(f"Answer: {answer}\n")
            else:
                print("No relevant information found in the processed data.\n")
        else:
            print("Please ensure the processed data and embeddings are generated first.\n")
