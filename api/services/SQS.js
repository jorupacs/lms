const AWS = require('aws-sdk');

module.exports = function() {
  this.sendToQueue = (lead, queueUrl, callback) => {
    const sqs = new AWS.SQS({
      region: 'ap-southeast-1'
    });

    console.log(sendToQueue);
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
}
