'use strict;'

require('./services/SNS')();
require('./services/SQS')();

const req = require('request');

const msgSubjectFailed = "Send to dialler failed";
const msgSubjectSuccess = "Send to dialler success";
const srcQueue = 'https://sqs.' + process.env.REGION  + '.amazonaws.com/' + process.env.ACCOUNT_ID + '/'+ process.env.DIALLER_QUEUE;

module.exports.insert = (event, context, callback) => {
  console.log('receive queue was called');
  var leadInfo = event.Records[0].body;
  console.log(leadInfo);
  sendToDialler(leadInfo, callback);
}

const sendToDialler = (data, callback) => {
  console.log(sendToDialler);
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
      url: process.env.CRM_API_DIALLER,
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
          var message = `${JSON.stringify(leadInfo)}`;
          pushNotification(msgSubjectSuccess, message);
          callback();
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
          pushNotification(msgSubjectFailed, message);
          sendToQueue(data, srcQueue, callback);
        }
    }
  });
}
