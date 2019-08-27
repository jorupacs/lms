const AWS = require('aws-sdk');

module.exports = function() {
  this.pushNotification = (subject, message) => {
    console.log(pushNotification);
    var sns = new AWS.SNS();
    var params = {
        Message: message,
        Subject: subject,
        TopicArn: `arn:aws:sns:${process.env.REGION}:${process.env.ACCOUNT_ID}:${process.env.SNS_TOPIC}`
    };

    console.log(params);

    sns.publish(params, function(err, data) {
      if (err) console.log(err, err.stack);
      else console.log(data);
    });
  }
}
