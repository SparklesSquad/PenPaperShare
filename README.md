# PenPaperShare

# How to Install the Code from Github

1. Copy the URL from Github.
2. Create a folder for the project and open the terminal and navigate to the project folder.
3. Type : git clone URL
4. It will download the project in the specified folder.

# How to run the code

1.  In VSCODE, Open the terminal by clicking on the terminal > New Terminal in the menu bar.
2.  The terminal will be opened in the bottom.
3.  Navigate to the backend folder by typing : cd backend
4.  Install all the dependencies by typing : npm install
5.  After installing the dependencies,
6.  Start the server by typing : node server.js

# Status codes

Summary:
200 OK: Successful GET or PUT requests.
201 Created: Successful POST request (resource created).
204 No Content: Successful request with no data to return.
400 Bad Request: Invalid request due to client error.
401 Unauthorized: Authentication failure.
403 Forbidden: Insufficient permissions.
404 Not Found: Resource not found.
409 Conflict: Conflict with current resource state.
413 Payload Too large
500 Internal Server Error: Generic server error.
503 Service Unavailable: Server is down or overloaded.

# Getting first page of the PDF

When admin approves the document, the first page should be extracted not when the file is uploaded

# Image Extraction -

We need to install ghostscript and graphicsmagick into the system in order to perform this image extraction.

- Extracts the PDF from the s3.
- Create a new PDF
- copy the first page into the new pdf.
- Convert the single page into image and store it in tempimages folder.
- Read the image and store it in S3.
- Update the document with the image URL and key and approve the document.
- Delete the image from the tempimages folder.

# Admin Dashboard

    ## Analytics
        DONE

    ## Docs
        - Get all the documents from the server with a single request with status counts.
        - Handle the filter for status in frontend.

    ## Users
        - Get all the users and their count.
