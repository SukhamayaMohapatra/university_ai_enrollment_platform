# AI-Powered University Application System & SQL Assistant

## Prerequisites
- Node.js (v18+)
- MongoDB running locally or a MongoDB Atlas URI
- Mistral AI API Key

## Setup Instructions

### 1. Backend Setup
Navigate to the backend directory:
\`\`\`bash
cd backend
npm install
\`\`\`
Create a \`.env\` file in the \`backend\` directory with the following:
\`\`\`env
PORT=5000
MONGO_URI=mongodb://localhost:27017/university_db
MISTRAL_API_KEY=your_mistral_api_key
\`\`\`
Seed the database and start the server:
\`\`\`bash
node seed.js
npm run dev
\`\`\`

### 2. Frontend Setup
Open a new terminal and navigate to the frontend directory:
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
The application will be accessible at \`http://localhost:3000\`.
