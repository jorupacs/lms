'use strict;'

require('./services/SNS')();
require('./services/SQS')();

const req = require('request');

const msgSubject = "Data enrichment failed";
const srcQueue = 'https://sqs.' + process.env.REGION  + '.amazonaws.com/' + process.env.ACCOUNT_ID + '/'+ process.env.ENRICH_QUEUE;
const destQueue = 'https://sqs.' + process.env.REGION  + '.amazonaws.com/' + process.env.ACCOUNT_ID + '/'+ process.env.DIALLER_QUEUE;

module.exports.enrich = (event, context, callback) => {
  console.log('receive queue was called');
  var leadInfo = event.Records[0].body;
  console.log(leadInfo);
  dataEnrich(leadInfo, callback);
}

const dataEnrich = (data, callback) => {
  console.log(dataEnrich);
  data = JSON.parse(data);
  console.log(data);
  console.log(data.id);
  leadInfo = {
    id: data.id,
    firstname: data.firstname,
    lastname: data.lastname,
    phone: data.phone
  }
  const params = {
      url: process.env.CRM_API_ENRICH,
      headers: { 'Content-Type': 'application/json' },
      json: leadInfo
  };

  console.log(params);

  req.post(params, function(err, res, body) {

    if (err) {
        console.log(err);
        callback();
    } else {
        console.log(`Success: ${body.success}`);
        console.log(data);

        if (body.success) {
          console.log(`${data.id} added successfully`);
          sendToQueue(leadInfo, destQueue, callback);
        } else {
          console.log(`earlier attempts: ${data.attempt}`);

          if (data.attempt === undefined)
            data.attempt = 1;
          else {
            var attempt = data.attempt * 1;
            data.attempt = attempt + 1;
          }

          console.log(`total attempts: ${data.attempt}`);

          var message = `${data.id} repeat attempt`;
          console.log(message);
          pushNotification(msgSubject, message);
          sendToQueue(data, srcQueue, callback);
        }
    }
  });
}
