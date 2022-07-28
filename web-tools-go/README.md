# Go Backend Server

This is the backend-part of this project. The server is written in Go and utilizes a selection of libraries, including:

- [gin](https://github.com/gin-gonic/gin) to expose the API endpoints
- [cors](https://github.com/rs/cors) to configure gin for CORS requests. By default, all requests are accepted
- [pdfcpu](github.com/pdfcpu/pdfcpu) to process PDF documents

The server exposes 3 endpoints:

- `/image`: For image processing (grayscaling, inverting, ...)
- `/document`: For document processing (PDF merging, ...)

## Caching
The server temporarily stores files in the `cache` directory. A cache worker periodically cleans up the directory at runtime. Per default, every minute, files that are older than 5 minutes are deleted.

# Running
Use `go get .` to install dependencies. Use `go run .` in the root directory of the server to start the execution of `main.go`.
