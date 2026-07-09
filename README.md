# AI-Powered University Application System & SQL Assistant

## Live Deployment Links
* **Frontend (Vercel):** (https://university-ai-enrollment-platform.vercel.app/)
* **Backend API (Render):** (https://university-ai-enrollment-platform.onrender.com)

## Prerequisites
* Node.js v20+
* MongoDB Cluster (Atlas)
* Mistral AI API Key

## Local Setup Instructions

### 1. Backend Setup
\`\`\`bash
cd backend
npm install
\`\`\`
Create a \`.env\` file in the \`backend\` directory:
\`\`\`env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
MISTRAL_API_KEY=your_mistral_api_key
\`\`\`
Start the server:
\`\`\`bash
npm run dev
\`\`\`

### 2. Frontend Setup
Open a new terminal:
\`\`\`bash
cd frontend
npm install
\`\`\`
Create a \`.env.local\` file in the \`frontend\` directory:
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
\`\`\`
Start the client:
\`\`\`bash
npm run dev
\`\`\`
