import os

from fastapi import Depends, FastAPI, Header, HTTPException
from pydantic import BaseModel

from services.database import get_db_connection
from services.schema_rag import (
    index_schema,
    retrieve_relevant_schema,
)
from services.schema_service import get_database_schema
from services.sql_generator import generate_sql
from services.sql_validator import validate_sql
from services.query_pipeline import process_query


app = FastAPI(title="QueryPilot AI Service")


AI_SERVICE_KEY = os.getenv("AI_SERVICE_KEY")


def verify_internal_key(
    x_internal_key: str = Header(None)
):
    print("🔥 INTERNAL KEY RECEIVED:", bool(x_internal_key))
    print("🔥 AI SERVICE KEY EXISTS:", bool(AI_SERVICE_KEY))

    if not AI_SERVICE_KEY:
        raise HTTPException(
            status_code=500,
            detail="AI service key is not configured."
        )

    if x_internal_key != AI_SERVICE_KEY:
        print("🔥 INTERNAL KEY MISMATCH")
        raise HTTPException(
            status_code=401,
            detail="Unauthorized AI service request."
        )

class SQLRequest(BaseModel):
    query: str
    schema: str


class QueryRequest(BaseModel):
    query: str


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():
    return {
        "message": "QueryPilot AI Service is running"
    }


# ============================================================
# AI SERVICE HEALTH
# ============================================================

@app.get("/health")
def health(
    _: None = Depends(verify_internal_key)
):
    return {
        "status": "healthy",
        "service": "QueryPilot AI Service"
    }


# ============================================================
# DATABASE HEALTH
# ============================================================

@app.get("/database-health")
def database_health(
    _: None = Depends(verify_internal_key)
):
    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("SELECT 1")
        cursor.fetchone()

        return {
            "success": True,
            "status": "connected",
            "database": "PostgreSQL"
        }

    except Exception as e:
        print("🔥 DATABASE CONNECTION ERROR:", repr(e))
        return {
            "success": False,
            "status": "disconnected",
            "database": "PostgreSQL",
            "error": str(e)
        }

    finally:
        try:
            if cursor:
                cursor.close()

            if connection:
                connection.close()

        except Exception:
            pass


# ============================================================
# DATABASE SCHEMA
# ============================================================

@app.get("/schema")
def schema(
    _: None = Depends(verify_internal_key)
):
    try:
        database_schema = get_database_schema()

        return {
            "success": True,
            "schema": database_schema
        }

    except Exception:
        return {
            "success": False,
            "schema": {},
            "error": "Unable to retrieve database schema."
        }


# ============================================================
# INDEX DATABASE SCHEMA
# ============================================================

@app.post("/index-schema")
def index_database_schema(
    _: None = Depends(verify_internal_key)
):
    try:
        database_schema = get_database_schema()

        return index_schema(database_schema)

    except Exception:
        return {
            "success": False,
            "error": "Unable to index database schema."
        }


# ============================================================
# RETRIEVE RELEVANT SCHEMA
# ============================================================

@app.get("/retrieve-schema")
def retrieve_schema(
    query: str,
    _: None = Depends(verify_internal_key)
):
    try:
        results = retrieve_relevant_schema(query)

        return {
            "query": query,
            "results": results
        }

    except Exception:
        return {
            "success": False,
            "error": "Unable to retrieve relevant schema."
        }


# ============================================================
# GENERATE SQL
# ============================================================

@app.post("/generate-sql")
def generate_sql_endpoint(
    request: SQLRequest,
    _: None = Depends(verify_internal_key)
):
    try:
        return generate_sql(
            request.query,
            request.schema
        )

    except Exception:
        return {
            "success": False,
            "error": "Unable to generate SQL."
        }


# ============================================================
# MAIN QUERY PIPELINE
# ============================================================

@app.post("/query")
def query_database(
    request: QueryRequest,
    _: None = Depends(verify_internal_key)
):
    print("🔥 /query ENDPOINT HIT")
    print("🔥 QUERY:", request.query)

    try:
        result = process_query(request.query)

        print("🔥 PROCESS_QUERY RESULT:", result)

        return result

    except Exception as e:
        print("🔥 PROCESS_QUERY ERROR:", repr(e))

        return {
            "success": False,
            "error": str(e)
        }
    
# ============================================================
# VALIDATE SQL
# ============================================================

@app.get("/validate-sql")
def validate_sql_endpoint(
    sql: str,
    _: None = Depends(verify_internal_key)
):
    try:
        return validate_sql(sql)

    except Exception:
        return {
            "valid": False,
            "error": "Unable to validate SQL."
        }