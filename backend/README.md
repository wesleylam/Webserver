# Install required node modules
`npm install`

# Start server 
`npm start`

# Create ssl certificate (for https) >> Require req.cnf
`openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout cert.key -out cert.pem -config req.cnf -sha256`
