from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter

# Define the path for the data and the vector store
DATA_PATH = 'data/LegalEase.pdf'
DB_FAISS_PATH = 'vectorstore/db_faiss'

# Function to create the vector store
def create_vector_db():
    # Load the document
    loader = PyPDFLoader(DATA_PATH)
    documents = loader.load()
    print(f"Loaded {len(documents)} document(s).")

    # Split the document into chunks
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    texts = text_splitter.split_documents(documents)
    print(f"Split into {len(texts)} chunks.")

    # Define the embedding model
    embeddings = HuggingFaceEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2',
                                       model_kwargs={'device': 'cpu'})

    # Create the FAISS vector store from the texts and embeddings
    db = FAISS.from_documents(texts, embeddings)
    db.save_local(DB_FAISS_PATH)
    print(f"Vector store created and saved at {DB_FAISS_PATH}")

if __name__ == '__main__':
    create_vector_db()