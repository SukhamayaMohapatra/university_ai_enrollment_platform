# API Endpoints

### Task 1: Allocation Engine
* **POST** `/api/allocation/process`
    * Executes the allocation algorithm. Evaluates marks, application dates, and category reservations.
* **GET** `/api/allocation/dashboard`
    * Retrieves all students and course capacities for UI rendering.
* **POST** `/api/allocation/ai-query`
    * Payload: `{ "question": "string" }`
    * Returns context-aware AI insights about the allocation results.

### Task 2: AI SQL Assistant
* **POST** `/api/analytics/upload`
    * Payload: `multipart/form-data` (CSV file)
    * Parses CSV, creates a dynamic Mongoose schema, and returns the unique collection name.
* **POST** `/api/analytics/query`
    * Payload: `{ "collectionName": "string", "prompt": "string" }`
    * Converts natural language to MongoDB Query Language (MQL) and executes it against the uploaded dataset.
* **GET** `/api/analytics/history`
    * Retrieves the 10 most recent AI queries and their generated MQL execution syntax.
