from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agent import load_embeddings, find_relevant_chunks, ask_agent

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

embeddings = load_embeddings("./data/netflix_help_embeddings.json")

@app.post("/chat")
def chat_endpoint(request: ChatRequest):
    chunks = find_relevant_chunks(request.message, embeddings)
    answer = ask_agent(request.message, chunks)
    return {"answer": answer}
