from fastapi import FastAPI
from pydantic import BaseModel

from services.sql_generator import generate_sql
from services.schema_service import get_database_schema
from services.schema_rag import (
    index_schema,
    retrieve_relevant_schema
)


app = FastAPI(title="QueryPilot AI Service")


class SQLRequest(BaseModel):
    query: str
    schema: str


@app.get("/")
def root():
    return {
        "message": "QueryPilot AI Service is running 🤖"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.get("/schema")
def schema():

    return {
        "success": True,
        "schema": get_database_schema()
    }


@app.post("/index-schema")
def index_database_schema():

    schema = get_database_schema()

    return index_schema(schema)


@app.get("/retrieve-schema")
def retrieve_schema(query: str):

    results = retrieve_relevant_schema(query)

    return {
        "query": query,
        "results": results
    }


@app.post("/generate-sql")
def generate_sql_endpoint(request: SQLRequest):

    result = generate_sql(
        request.query,
        request.schema
    )

    return result