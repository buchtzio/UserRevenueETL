# UserRevenueETL - Event Processing System

## Project Overview
This project demonstrates a simple ETL (Extract, Transform, Load) system that processes user revenue events.
It consists of three main components:  
1. **Client**: Extracts event data from a file and sends it to the server.  
2. **Server**: Receives events from the client, processes the data, and saves it to a local file. The server also updates the database.  
3. **Data Processor**: Processes the saved data files on the server side and updates the database accordingly.  

The system is designed to handle revenue events where a user can either add or subtract revenue. 
It supports concurrent processing by creating unique files for each client request.

## Prerequisites
- **Node.js** (version 14.x or higher)  
- **PostgreSQL** (version 12.x or higher)

## Setup Instructions  

1. **Install dependencies**  
To install all necessary dependencies, run:  
npm install  


2. **Setup PostgreSQL Database**  
1. Open your PostgreSQL CLI or pgAdmin.  
2. Run the following commands to create the database and user for the project:  

CREATE DATABASE user_revenue_etl_db; 
CREATE USER etl_project_user WITH ENCRYPTED PASSWORD 'your_postgres_password';  
GRANT ALL PRIVILEGES ON DATABASE user_revenue_etl_db TO etl_project_user; 

3. Run the SQL script (`db.sql`) to create the necessary table:  
psql -U etl_project_user -d user_revenue_etl_db -f db.sql

3. **Run the Server**  
Start the server by running:  
node server.js  

4. **Run the Client**  
To send events from the client to the server, run:  
node client.js  

5. **Run the Data Processor**  
To process the events and update the user revenue in the database, run:  
node data_processor.js  

## Notes 
- To get the data for a given user from the database table, you can use postman or this curl command:
 curl http://localhost:8000/userEvents/<userId>
 
- To keep the solution simple, files are deleted after processing. However, as an alternative, the files can be moved to an archive directory for backup purposes if needed.

- Handling of Edge Cases
In this implementation, I have deliberately chosen not to address certain edge cases that could occur during the execution of various processes. This decision was made to keep the solution simple, aligned with the explicit requirements of the assignment, and avoid overcomplicating the system.

Some of the unhandled edge cases include:

Client-Side Failures: If the client process is interrupted while sending events to the server, the system will not track the progress, and upon restarting, the client will resend all events from the beginning. A more complex solution could involve tracking progress to avoid resending already processed events.

Server-Side Failures: If the server process fails or restarts while handling client requests, no additional mechanisms were implemented to retry or ensure the integrity of incoming events. A more advanced system could involve message queuing or transaction logging.

Data Processor Failures: If the Data Processor is interrupted while processing a file, the partially processed file will remain in the directory. Upon restarting, the Data Processor will ignore that file and continue processing new files. In a more complex implementation, the system could track the progress of partially processed files and resume processing them after failure.

Although these scenarios could be addressed with additional mechanisms (such as progress tracking, retries, and more robust error handling), they were intentionally left unimplemented to maintain the simplicity of the solution, as requested in the assignment.

- System Testing
To ensure the system performs well under various conditions, I conducted several tests, including:

Running the Data Processor with multiple instances in parallel to verify how the system handles concurrent processing.
Testing the system's ability to handle large files, such as a file containing 1 million records, to assess how it impacts system performance.
These tests demonstrated that the system can handle both large-scale data and concurrent processing without issues.




