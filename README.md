# Lead Management System


## Installation 
```bash
$ npm install --save uuid
$ npm install --save bluebird
$ npm install --save request
```

## Config
In serverless.yaml update the following configuration to work on your AWS setup.

```yaml
  environment:
    # Fill with proper path
    CRM_API_ADD: https://qwertyuiop.execute-api.ap-southeast-1.amazonaws.com/dev/crm/add
    CRM_API_ENRICH: https://qwertyuiop.execute-api.ap-southeast-1.amazonaws.com/dev/crm/enrich
    CRM_API_DIALLER: https://qwertyuiop.execute-api.ap-southeast-1.amazonaws.com/dev/crm/dialler
    # Fill with proper account ID
    ACCOUNT_ID: XXXXXXXXXXXX    
```

## Deploy using Serverless

```bash
$ sls deploy
```

## API
Call the endpoint to add data in DynamoDb and start the leads processing

POST - https://[api-gateway-assigned-subdomain].[aws-region].amazonaws.com/dev/leads
Body:
```json
{
  "firstname": "Mark", 
  "lastname": "Lee", 
  "phone": "09999999999"
 }
```
