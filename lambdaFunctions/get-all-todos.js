const tableName = process.env.TODO_TABLE_NAME;

//Create dynamo DB client
const dynamodb = require('aws-sdk/clients/dynamodb');
//doc client to represent query
const docClient = new dynamodb.DocumentClient();

exports.getAllTodosHandler = async (event) => {
    if(event.httpMethod != 'GET') {
         throw new Error(`getAllTodosHandler will only accept GET method, not ${event.httpMethod}`);
    }
    console.info("received : ", event);

    var prams = {
        TableName: tableName
    }

    const data = await docClient.scan(prams).promise();
    const items = data.items;

    const response = {
        statusCode:200,
        body: JSON.stringify(items)
    };

    console.info("response : ", response.statusCode);

    return response;
}