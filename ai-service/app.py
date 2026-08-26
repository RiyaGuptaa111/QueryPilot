
from fastapi import FastAPI
from pydantic import BaseModel

from services.sql_generator import generate_sql
from services.schema_service import get_database_schema
from services.schema_rag import (
    index_schema,
    retrieve_relevant_schema
)
from services.query_pipeline import process_query
from services.sql_validator import validate_sql

app = FastAPI(title="QueryPilot AI Service")
print("🔥🔥🔥 APP.PY LOADED 🔥🔥🔥")

class SQLRequest(BaseModel):
    query: str
    schema: str

class QueryRequest(BaseModel):
    query: str

@app.get("/")
def root():

    print("🔥🔥🔥 ROOT ENDPOINT CALLED 🔥🔥🔥")

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

@app.post("/query")
def query_database(request: QueryRequest):

    print("🔥🔥🔥 /QUERY ENDPOINT CALLED 🔥🔥🔥")
    print("QUERY:", request.query)

    try:

        print("🔥🔥🔥 CALLING PROCESS_QUERY 🔥🔥🔥")

        result = process_query(request.query)

        print("🔥🔥🔥 PROCESS_QUERY RETURNED 🔥🔥🔥")

        return result

    except Exception as error:

        print("❌❌❌ QUERY ERROR ❌❌❌")
        print("ERROR:", error)

        import traceback
        traceback.print_exc()

        return {
            "success": False,
            "error": str(error)
        }
    
@app.get("/validate-sql")
def validate_sql_endpoint(sql: str):

    return validate_sql(sql)