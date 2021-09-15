# Backend API for webserver
Built using Node.js with Express package.

## Install required node modules and Start API server
`npm install`
`npm start`

## Required configuration
- `config.js`: Deployment port and http/https settings
- `knexfile.js`: MySQL database login and connection settings
- `sslcert/`: Directory for https required keys (See below for self signed certificate)
    - `cert.key`: Private key for the certificate
    - `cert.pem`: Generated Public certificate 

## Create self signed ssl certificate
1. Configure/Create `myreq.cnf` containing certificate info
2. Run openssl command: `openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout cert.key -out cert.pem -config myreq.cnf -sha256`
