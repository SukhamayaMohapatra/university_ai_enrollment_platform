# Database Schema Design

## 1. Student Collection
* `studentId`: String (Unique, Required)
* `name`: String (Required)
* `marks`: Number (Required)
* `category`: String (Enum: ['General', 'OBC', 'SC', 'ST'])
* `applicationDate`: Date (Required)
* `preferences`: Array of Strings (Course Names, Priority 1 to 3)
* `allocatedCourse`: String (Default: null)

## 2. Course Collection
* `name`: String (Unique, Required)
* `totalSeats`: Number (Required)
* `reservedSeats`: Object { General: Number, OBC: Number, SC: Number, ST: Number }
* `filledSeats`: Object { General: Number, OBC: Number, SC: Number, ST: Number }

## 3. Query History Collection (Task 2)
* `datasetName`: String (Required)
* `naturalLanguageQuery`: String (Required)
* `generatedQuery`: String (Required - MQL/JSON format)
* `createdAt`: Date (Default: Date.now)
