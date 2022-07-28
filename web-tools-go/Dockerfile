FROM golang:latest

# Create app directory
RUN mkdir /app
ADD . /app
WORKDIR /app

# Create server cache directory
RUN mkdir cache

# Install app dependencies
RUN go get .

# Build executable
RUN go build -o main .

CMD ["/app/main"]