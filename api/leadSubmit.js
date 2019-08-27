'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const firstname = requestBody.firstname;
  const lastname = requestBody.lastname;
  const phone = requestBody.phone;

  submitLeadP(leadInfo(firstname, lastname, phone))
    .then(res => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Sucessfully submitted lead with phone ${phone}`,
          candidateId: res.id
        })
      });
    })
    .catch(err => {
      console.log(err);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `Unable to submit lead with phone ${phone}`
        })
      })
    });
};

const submitLeadP = lead => {
  console.log('Submitting lead');
  const leadInfo = {
    TableName: process.env.LEAD_TABLE,
    Item: lead,
  };

  return dynamoDb.put(leadInfo).promise()
    .then(res => lead);
};

const leadInfo = (firstname, lastname, phone) => {
  return {
    id: uuid.v1(),
    firstname: firstname,
    lastname: lastname,
    phone: phone,
  };
};
