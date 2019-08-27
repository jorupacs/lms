'use strict;'

const AWS = require('aws-sdk');

const sqs = new AWS.SQS({
  region: 'ap-southeast-1'
});

module.exports.handler = (event, context, callback) => {
  console.log('trigger stream was called');
  const eventData = event.Records[0];
  leadInfo = formatLeadInfo(eventData.dynamodb.NewImage);

  if (leadInfo !== null)
    sendToQueue(leadInfo, callback);
  else
    callback();
}

const formatLeadInfo = (leadInfo) => {
  console.log('formatLeadInfo');

  if (leadInfo !== undefined)
    return {
      id: leadInfo.id.S,
      firstname: leadInfo.firstname.S,
      lastname: leadInfo.lastname.S,
      phone: leadInfo.phone.S
    }
  else
    return null;
}

const sendToQueue = (lead, callback) => {
  console.log(sendToQueue);
  var queueUrl = 'https://sqs.' + process.env.REGION  + '.amazonaws.com/' + process.env.ACCOUNT_ID + '/'+ process.env.CRM_QUEUE;
  var params = {
      MessageBody: JSON.stringify(lead),
      QueueUrl: queueUrl
  };

  console.log(params);

  sqs.sendMessage(params, function(err, data) {
      if (err) {
          console.log('error:', "failed to send message" + err);
      } else {
          console.log('data:', data.MessageId);
      }

      callback();
  });
};
