from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.llms import HuggingFaceHub  # We will use a placeholder model for now

DB_FAISS_PATH = 'vectorstore/db_faiss'

def main():
    # Load the embedding model
    embeddings = HuggingFaceEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2',
                                       model_kwargs={'device': 'cpu'})

    # Load the FAISS vector store
    db = FAISS.load_local(DB_FAISS_PATH, embeddings, allow_dangerous_deserialization=True)

    # Define a simple query
    query = "What is FAISS?"
    print(f"Query: {query}")

    # Perform a similarity search to find relevant documents
    results = db.similarity_search(query)

    # Print the results
    print("\n--- Top 3 Relevant Documents ---")
    for i, doc in enumerate(results[:3]):
        print(f"\nResult {i+1}:")
        print(doc.page_content)
        print("--------------------")

if __name__ == '__main__':
    main()