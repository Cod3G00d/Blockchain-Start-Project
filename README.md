# Blockchain Data

Blockchain has the potential to change the way that the world approaches data. Develop Blockchain skills by understanding the data model behind Blockchain by developing your own simplified private blockchain.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js® web site)[https://nodejs.org/en/].

### Configuring your project

- Use npm to install all project dependencies.
```
npm install

```

## Rest API Blockchain
This is an example of how to insert and verify data in blockchain.

### Run the server

- By default the server runs at localhost: 8000.

- Use npm to start application .
```
npm start
```

### Validate User Request

#### URL
```
http://localhost:8000/requestValidation
```
#### Method:
```
POST
```
#### URL Params
##### Required:
```
address = [string]
```

#### Success Response:
```
Code: 200 
Content: 
{
  "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
  "requestTimeStamp": "1532296090",
  "message": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ:1532296090:starRegistry",
  "validationWindow": 300
}
```
#### Error Response:
```
{
    "statusCode": Code,
    "error": Error,
    "message": message error
}
```
#### Sample Call:
```
curl -X "POST" "http://localhost:8000/requestValidation" \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{
  "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ"
}'
 
```


### Allow User Message Signature

#### URL
```
http://localhost:8000/message-signature/validate
```

#### Method:
```
POST
```

#### URL Params

##### Required:
```
address = [string]
signature = [string]
```

#### Success Response:
```
Code: 200 
Content: 
{
 {
  "registerStar": true,
  "status": {
    "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
    "requestTimeStamp": "1532296090",
    "message": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ:1532296090:starRegistry",
    "validationWindow": 193,
    "messageSignature": "valid"
  }
 }
}
```

#### Error Response:
```
{
    "statusCode": Code,
    "error": Error,
    "message": message error
}
```

#### Sample Call:
```
 curl -X "POST" "http://localhost:8000/message-signature/validate" \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{
  "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
  "signature": "H6ZrGrF0Y4rMGBMRT2+hHWGbThTIyhBS0dNKQRov9Yg6GgXcHxtO9GJN4nwD2yNXpnXHTWU9i+qdw5vpsooryLU="
}'
```

### Star Registration

#### URL
```
http://localhost:8000/block
```

#### Method:
```
POST
```

#### URL Params

##### Required:
```
address = [string]
star.dec = [string]
star.ra = [string]
star.story = [string]
```
##### Optional:
```
magnitude = [string] 
constellation =  [string]
```

#### Success Response:
```
Code: 200 
Content: 
{
    {
  "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
  "height": 1,
  "body": {
    "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
    "star": {
      "ra": "16h 29m 1.0s",
      "dec": "-26° 29' 24.9",
      "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f"
    }
  },
  "time": "1532296234",
  "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
}
}
```

#### Error Response:
```
{
    "statusCode": Code,
    "error": Error,
    "message": message error
}
```

#### Sample Call:
```
 curl -X "POST" "http://localhost:8000/block" \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{
  "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
  "star": {
    "dec": "-26° 29'\'' 24.9",
    "ra": "16h 29m 1.0s",
    "story": "Found star using https://www.google.com/sky/"
  }
}
```

### Search by Blockchain Wallet Address


#### URL
```
http://localhost:8000/stars/address:[ADDRESS]
```

#### Method:
```
GET
```

#### URL Params

##### Required:
```
address = [string]
```

#### Success Response:
```
Code: 200 
Content: 
{
 [
  {
    "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
    "height": 1,
    "body": {
      "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
      "star": {
        "ra": "16h 29m 1.0s",
        "dec": "-26° 29' 24.9",
        "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
        "storyDecoded": "Found star using https://www.google.com/sky/"
      }
    },
    "time": "1532296234",
    "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
  },
  {
    "hash": "6ef99fc533b9725bf194c18bdf79065d64a971fa41b25f098ff4dff29ee531d0",
    "height": 2,
    "body": {
      "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
      "star": {
        "ra": "17h 22m 13.1s",
        "dec": "-27° 14' 8.2",
        "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
        "storyDecoded": "Found star using https://www.google.com/sky/"
      }
    },
    "time": "1532330848",
    "previousBlockHash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f"
  }
 ]
}
```

#### Error Response:
```
{
    "statusCode": Code,
    "error": Error,
    "message": message error
}
```

#### Sample Call:
```
 curl "http://localhost:8000/stars/address:142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ"
```

### Search by Star Block Hash

#### URL
```
http://localhost:8000/stars/hash:[HASH]
```

#### Method:
```
GET
```

#### URL Params

##### Required:
```
hash = [string]
```

#### Success Response:
```
Code: 200 
Content: 
{
 {
  "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
  "height": 1,
  "body": {
    "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
    "star": {
      "ra": "16h 29m 1.0s",
      "dec": "-26° 29' 24.9",
      "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
      "storyDecoded": "Found star using https://www.google.com/sky/"
    }
  },
  "time": "1532296234",
  "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
 }
}
```

#### Error Response:
```
{
    "statusCode": Code,
    "error": Error,
    "message": message error
}
```

#### Sample Call:
```
 curl "http://localhost:8000/stars/hash:a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f"
```

### Get a specific Block

#### URL
```
/block/:number
```

#### Method:
```
GET
```

#### URL Params

##### Required:
```
number=[integer]
```

#### Success Response:
```
Code: 200 
Content: 
{
 {
  "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
  "height": 1,
  "body": {
    "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
    "star": {
      "ra": "16h 29m 1.0s",
      "dec": "-26° 29' 24.9",
      "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
      "storyDecoded": "Found star using https://www.google.com/sky/"
    }
  },
  "time": "1532296234",
  "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
 }
}
```

#### Error Response:
```
{
    "statusCode": Code,
    "error": Error,
    "message": message error
}
```

#### Sample Call:
```
curl "http://localhost:8000/block/1"
```





