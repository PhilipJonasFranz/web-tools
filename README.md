# web-tools

[![version](https://img.shields.io/badge/version-0.1.0-red.svg)](https://semver.org) [![status](https://img.shields.io/badge/status-development-red.svg)](https://semver.org)

![alt text](https://github.com/PhilipJonasFranz/web-tools/blob/main/ressources/web-tools-screenshot.png?raw=true)

A web-based toolbox with a [Vue.js](https://vuejs.org/) frontend and [Go](https://go.dev/) backend service. The toolbox includes a wide range of frequently used tools such as a PDF utilities, and simple image processing and conversion tools. Say goodbye to paywalls, ads, sign-ups and sketchy software. Processing is done entirely on your server, ensuring full control of your data. 

**While the tool is free and easy to use, it is not very secure. Files are temporarily cached on the backend server, with no authentification required to retrieve them. It is not recommended to expose this service without further consideration.**

## Features

### Tools

Below you can find a list of tools that are included in this toolbox:

#### PDF Processing

- Merge PDF documents
- Rotate PDF documents
- Convert images to PDF

#### Image Processing

- Image color grayscaling
- Image color inversion
- Add transparency to images

#### Miscellaneous

- Latex Equation Mathjax Viewer
- Graphviz Viewer

### Additionally:

- Workspace customization
- Mobile support
- Settings persistence with cookies
- Darkmode

# Installation

Using docker compose, run

```
docker compose up
```

to start the service. The service will be available on port `8080`. The backend will use port `8081`. You can customize these settings in the `docker-compose.yml`.
