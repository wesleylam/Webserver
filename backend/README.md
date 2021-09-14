install required node modules
- npm install

start server 
- npm start

Create ssl certificate (for https?) >> Require req.cnf
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout cert.key -out cert.pem -config myreq.cnf -sha256
