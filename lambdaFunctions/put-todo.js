const tableName = process.env.TODO_TABLE_NAME;

//Create dynamo DB client
const dynamodb = require('aws-sdk/clients/dynamodb');
//doc client to represent query
const docClient = new dynamodb.DocumentClient();

exports.putTodosHandler = async (event) => {
    if(event.httpMethod != 'POST') {
         throw new Error(`putTodosHandler will only accept POST method, not ${event.httpMethod}`);
    }
    console.info("received : ", event); 

    const body = JSON.parse(event.body);


    var prams = {
        TableName: tableName,
        item: {id: body.id, name: body.name}
    }

    const data = await docClient.put(prams).promise();
    const items = data.items;

    const response = {
        statusCode:200,
        body: JSON.stringify(items)
    };

    console.info("response : ", response.statusCode);

    return response;
}