import axios from 'axios';
import store from './store';

function fileFromBase64(dataurl, filename) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
        
    while(n--) u8arr[n] = bstr.charCodeAt(n);

    return new File([u8arr], filename, {type:mime});
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

async function handleFileRequest(endpoint, requestMsg, args, uploads) {
    store.state.waitingForServer = true;
    
    let encodedFiles = [];

    for (const upload of uploads) {
        let B64ENC = await fileToBase64(upload.file);
        encodedFiles.push(B64ENC);
    }

    let request = {
        ID: requestMsg,
        ARGS: args,
        Files: encodedFiles
    }

    var requestURL = window.location.hostname + ':8081/' + endpoint;
    if (!requestURL.startsWith("http"))
    requestURL = 'http://' + requestURL;

    axios.post(requestURL, JSON.stringify(request)).then(resp => {
        let cnt = 0;
        for (const encodedFile of resp.data.Files) {
            let decodedFile = fileFromBase64(encodedFile, 'result' + cnt++ + '.png');
            store.commit("uploadFile", decodedFile);
        }

        store.commit("clearSelection");
        store.state.waitingForServer = false;
    });
}

async function handleFileDownloadRequest(endpoint, requestMsg, args, uploads, createdFileName) {
    store.state.waitingForServer = true;
    
    let encodedFiles = [];

    for (const upload of uploads) {
        let B64ENC = await fileToBase64(upload.file);
        encodedFiles.push(B64ENC);
    }

    let request = {
        ID: requestMsg,
        ARGS: args,
        Files: encodedFiles
    }

    var requestURL = window.location.hostname + ':8081/' + endpoint;
    if (!requestURL.startsWith("http"))
    requestURL = 'http://' + requestURL;

    axios.post(
        requestURL, 
        JSON.stringify(request),
        {
            responseType: 'blob'
        }, 
    ).then(response => {
        console.log(response)

        const url = window.URL.createObjectURL(new Blob([response.data]));

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', createdFileName);

        document.body.appendChild(link);
        link.click();

        store.state.waitingForServer = false;
    });
}

export { handleFileRequest, handleFileDownloadRequest }