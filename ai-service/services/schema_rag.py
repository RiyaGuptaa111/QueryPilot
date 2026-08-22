import chromadb
from chromadb.utils import embedding_functions


# Persistent local vector database
client = chromadb.PersistentClient(
    path="./chroma_db"
)


# Local embedding model
embedding_function = (
    embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name="all-MiniLM-L6-v2"
    )
)


collection = client.get_or_create_collection(
    name="database_schema",
    embedding_function=embedding_function
)


def create_schema_documents(schema):

    documents = []
    ids = []
    metadatas = []

    for table_name, table_info in schema.items():

        columns = []

        for column in table_info["columns"]:
            columns.append(
                f"{column['name']} ({column['type']})"
            )

        relationships = []

        for relation in table_info["relationships"]:
            relationships.append(
                f"{table_name}.{relation['column']} "
                f"references "
                f"{relation['references_table']}."
                f"{relation['references_column']}"
            )

        document = f"""
TABLE: {table_name}

COLUMNS:
{chr(10).join("- " + column for column in columns)}

RELATIONSHIPS:
{chr(10).join("- " + relation for relation in relationships)}
"""

        documents.append(document)
        ids.append(table_name)
        metadatas.append({
            "table": table_name
        })

    return documents, ids, metadatas


def index_schema(schema):

    documents, ids, metadatas = create_schema_documents(schema)

    if not documents:
        return {
            "indexed": 0
        }

    # Rebuild the collection so schema changes don't
    # leave old documents behind.
    collection.delete(
        where={}
    )

    collection.add(
        documents=documents,
        ids=ids,
        metadatas=metadatas
    )

    return {
        "indexed": len(documents),
        "tables": ids
    }


def retrieve_relevant_schema(query, top_k=3):

    if collection.count() == 0:
        return []

    results = collection.query(
        query_texts=[query],
        n_results=top_k
    )

    documents = results.get("documents", [[]])[0]

    return documents