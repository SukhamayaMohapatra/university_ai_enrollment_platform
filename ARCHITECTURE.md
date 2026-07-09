# Architecture & Design Document

## 1. Architecture Design
The application utilizes a decoupled Client-Server model. 
* **Frontend:** Next.js utilizing Material UI for a responsive, modern interface and Chart.js for data visualization. Client-side rendering is used for interactive dashboard components.
* **Backend:** Node.js with Express (using ES6 modules) handles routing and business logic.
* **Database:** MongoDB provides flexible NoSQL document storage, which is critical for handling the dynamic schemas required in Task 2.

## 2. Database Design Decisions
* **Task 1 (Normalized):** The `Student` and `Course` schemas are strictly structured. References are managed via programmatic logic to ensure reservation rules and merit hierarchies are strictly enforced before writing to the database.
* **Task 2 (Dynamic):** A flexible schema approach is used (`strict: false`). When a user uploads a CSV, a unique collection name is generated (e.g., `dataset_1715000000`), and a dynamic Mongoose model is instantiated on the fly to accommodate arbitrary dataset structures without requiring manual schema migrations.

## 3. AI Integration Approach
Mistral AI (`mistral-large-latest`) is integrated via the official `@mistralai/mistralai` SDK.
* **Context Injection:** For Task 1, the database state is summarized into JSON and injected into the system prompt, allowing the AI to answer specific questions about the allocation outcome.
* **Text-to-MQL Translation:** For Task 2, a sample document from the uploaded dataset is passed to the AI. The AI acts as a translation layer, converting English prompts into valid JSON-formatted MongoDB Aggregation Pipelines, which the backend then safely parses and executes.

## 4. Security Considerations
* Environment variables (`.env`) are used strictly to protect the MongoDB URI and Mistral API keys.
* The dynamically generated MQL queries in Task 2 are wrapped in `try/catch` blocks. If the AI hallucinates invalid JSON or attempts unauthorized commands, the `JSON.parse()` or Mongoose execution fails safely, returning a 500 error to the client rather than crashing the server.

## 5. Challenges Faced and Solutions Implemented
* **Challenge:** Mapping natural language to SQL/MQL on dynamic CSV files without knowing the column names in advance.
* **Solution:** I implemented a "Schema Sampling" technique. By reading the first document of the uploaded dataset and passing its JSON structure into the Mistral AI prompt, the LLM gains immediate context of the column names and data types, resulting in highly accurate query generation.
* **Challenge:** React state updates causing issues with PDF generation in Next.js Turbopack.
* **Solution:** Altered the `jspdf-autotable` import strategy to function as a direct functional call rather than a prototype extension, ensuring compatibility with modern bundlers.
* **Challenge:** GitHub Actions CI/CD pipeline failing due to missing Web Crypto APIs in older Node environments.
* **Solution:** Configured the pipeline to explicitly target Node 24 and injected a global crypto polyfill in the database configuration file to ensure universal environment compatibility.
