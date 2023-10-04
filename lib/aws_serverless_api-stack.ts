import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Function, Runtime, Code } from "aws-cdk-lib/aws-lambda";
import { RestApi, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AwsServerlessApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    //Dynamo Table
    const todoTable = new Table(this, "todo", {
      partitionKey:{name:"name", type:AttributeType.STRING}
    });
    
    // lambda function to GetAllTodosLambdaHandler
    const getAllTodosLambda = new Function(this, "GetAllTodosLambdaHandler", {
      runtime: Runtime.NODEJS_16_X,
      code: Code.fromAsset("lambdaFunctions"),
      handler: "get-all-todos.getAllTodosHandler",
      environment: {
        TODO_TABLE_NAME: todoTable.tableName,
      },
    });

    //give permission to lambda to access todoTable
    todoTable.grantReadWriteData(getAllTodosLambda)

    // lambda to write todo item into db
    const putTodoLambda = new Function(this, "PutTodoLambda", {
      runtime: Runtime.NODEJS_16_X,
      code: Code.fromAsset("lambdaFunctions"),
      handler: "put-todo.putTodosHandler",
      environment: {
        TODO_TABLE_NAME: todoTable.tableName,
      }
    });

    todoTable.grantReadWriteData(putTodoLambda)


    const api = new RestApi(this, "todo-api");
    api.root.resourceForPath("todo").addMethod("GET", new LambdaIntegration(getAllTodosLambda))
    api.root.resourceForPath("todo").addMethod("POST", new LambdaIntegration(putTodoLambda))

    new cdk.CfnOutput(this,"API-URL", {
      value: api.url ?? "Something Went Wrong"
    });
  }
}
