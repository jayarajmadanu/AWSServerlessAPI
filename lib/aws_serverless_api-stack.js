"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsServerlessApiStack = void 0;
const cdk = require("aws-cdk-lib");
const aws_dynamodb_1 = require("aws-cdk-lib/aws-dynamodb");
const aws_lambda_1 = require("aws-cdk-lib/aws-lambda");
const aws_apigateway_1 = require("aws-cdk-lib/aws-apigateway");
// import * as sqs from 'aws-cdk-lib/aws-sqs';
class AwsServerlessApiStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // The code that defines your stack goes here
        //Dynamo Table
        const todoTable = new aws_dynamodb_1.Table(this, "todo", {
            partitionKey: { name: "name", type: aws_dynamodb_1.AttributeType.STRING }
        });
        // lambda function to GetAllTodosLambdaHandler
        const getAllTodosLambda = new aws_lambda_1.Function(this, "GetAllTodosLambdaHandler", {
            runtime: aws_lambda_1.Runtime.NODEJS_16_X,
            code: aws_lambda_1.Code.fromAsset("functions"),
            handler: "get-all-todos.getAllTodosHandler",
            environment: {
                TODO_TABLE_NAME: todoTable.tableName,
            },
        });
        //give permission to lambda to access todoTable
        todoTable.grantReadWriteData(getAllTodosLambda);
        // lambda to write todo item into db
        const putTodoLambda = new aws_lambda_1.Function(this, "PutTodoLambda", {
            runtime: aws_lambda_1.Runtime.NODEJS_16_X,
            code: aws_lambda_1.Code.fromAsset("functions"),
            handler: "put-todo.putTodosHandler",
            environment: {
                TODO_TABLE_NAME: todoTable.tableName,
            }
        });
        todoTable.grantReadWriteData(putTodoLambda);
        const api = new aws_apigateway_1.RestApi(this, "todo-api");
        api.root.resourceForPath("todo").addMethod("GET", new aws_apigateway_1.LambdaIntegration(getAllTodosLambda));
        api.root.resourceForPath("todo").addMethod("POST", new aws_apigateway_1.LambdaIntegration(putTodoLambda));
        new cdk.CfnOutput(this, "API-URL", {
            value: api.url ?? "Something Went Wrong"
        });
    }
}
exports.AwsServerlessApiStack = AwsServerlessApiStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdzX3NlcnZlcmxlc3NfYXBpLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXdzX3NlcnZlcmxlc3NfYXBpLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFtQztBQUVuQywyREFBZ0U7QUFDaEUsdURBQWlFO0FBQ2pFLCtEQUF3RTtBQUV4RSw4Q0FBOEM7QUFFOUMsTUFBYSxxQkFBc0IsU0FBUSxHQUFHLENBQUMsS0FBSztJQUNsRCxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQzlELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLDZDQUE2QztRQUU3QyxjQUFjO1FBQ2QsTUFBTSxTQUFTLEdBQUcsSUFBSSxvQkFBSyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUU7WUFDeEMsWUFBWSxFQUFDLEVBQUMsSUFBSSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMsNEJBQWEsQ0FBQyxNQUFNLEVBQUM7U0FDdEQsQ0FBQyxDQUFDO1FBRUgsOENBQThDO1FBQzlDLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxxQkFBUSxDQUFDLElBQUksRUFBRSwwQkFBMEIsRUFBRTtZQUN2RSxPQUFPLEVBQUUsb0JBQU8sQ0FBQyxXQUFXO1lBQzVCLElBQUksRUFBRSxpQkFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUM7WUFDakMsT0FBTyxFQUFFLGtDQUFrQztZQUMzQyxXQUFXLEVBQUU7Z0JBQ1gsZUFBZSxFQUFFLFNBQVMsQ0FBQyxTQUFTO2FBQ3JDO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsK0NBQStDO1FBQy9DLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO1FBRS9DLG9DQUFvQztRQUNwQyxNQUFNLGFBQWEsR0FBRyxJQUFJLHFCQUFRLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRTtZQUN4RCxPQUFPLEVBQUUsb0JBQU8sQ0FBQyxXQUFXO1lBQzVCLElBQUksRUFBRSxpQkFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUM7WUFDakMsT0FBTyxFQUFFLDBCQUEwQjtZQUNuQyxXQUFXLEVBQUU7Z0JBQ1gsZUFBZSxFQUFFLFNBQVMsQ0FBQyxTQUFTO2FBQ3JDO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsU0FBUyxDQUFDLGtCQUFrQixDQUFDLGFBQWEsQ0FBQyxDQUFBO1FBRzNDLE1BQU0sR0FBRyxHQUFHLElBQUksd0JBQU8sQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDMUMsR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLGtDQUFpQixDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQTtRQUMzRixHQUFHLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLElBQUksa0NBQWlCLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQTtRQUV4RixJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFDLFNBQVMsRUFBRTtZQUNoQyxLQUFLLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxzQkFBc0I7U0FDekMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBN0NELHNEQTZDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEF0dHJpYnV0ZVR5cGUsIFRhYmxlIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWR5bmFtb2RiJztcbmltcG9ydCB7IEZ1bmN0aW9uLCBSdW50aW1lLCBDb2RlIH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1sYW1iZGFcIjtcbmltcG9ydCB7IFJlc3RBcGksIExhbWJkYUludGVncmF0aW9uIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWFwaWdhdGV3YXknO1xuXG4vLyBpbXBvcnQgKiBhcyBzcXMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXNxcyc7XG5cbmV4cG9ydCBjbGFzcyBBd3NTZXJ2ZXJsZXNzQXBpU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICAvLyBUaGUgY29kZSB0aGF0IGRlZmluZXMgeW91ciBzdGFjayBnb2VzIGhlcmVcblxuICAgIC8vRHluYW1vIFRhYmxlXG4gICAgY29uc3QgdG9kb1RhYmxlID0gbmV3IFRhYmxlKHRoaXMsIFwidG9kb1wiLCB7XG4gICAgICBwYXJ0aXRpb25LZXk6e25hbWU6XCJuYW1lXCIsIHR5cGU6QXR0cmlidXRlVHlwZS5TVFJJTkd9XG4gICAgfSk7XG4gICAgXG4gICAgLy8gbGFtYmRhIGZ1bmN0aW9uIHRvIEdldEFsbFRvZG9zTGFtYmRhSGFuZGxlclxuICAgIGNvbnN0IGdldEFsbFRvZG9zTGFtYmRhID0gbmV3IEZ1bmN0aW9uKHRoaXMsIFwiR2V0QWxsVG9kb3NMYW1iZGFIYW5kbGVyXCIsIHtcbiAgICAgIHJ1bnRpbWU6IFJ1bnRpbWUuTk9ERUpTXzE2X1gsXG4gICAgICBjb2RlOiBDb2RlLmZyb21Bc3NldChcImZ1bmN0aW9uc1wiKSxcbiAgICAgIGhhbmRsZXI6IFwiZ2V0LWFsbC10b2Rvcy5nZXRBbGxUb2Rvc0hhbmRsZXJcIixcbiAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgIFRPRE9fVEFCTEVfTkFNRTogdG9kb1RhYmxlLnRhYmxlTmFtZSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvL2dpdmUgcGVybWlzc2lvbiB0byBsYW1iZGEgdG8gYWNjZXNzIHRvZG9UYWJsZVxuICAgIHRvZG9UYWJsZS5ncmFudFJlYWRXcml0ZURhdGEoZ2V0QWxsVG9kb3NMYW1iZGEpXG5cbiAgICAvLyBsYW1iZGEgdG8gd3JpdGUgdG9kbyBpdGVtIGludG8gZGJcbiAgICBjb25zdCBwdXRUb2RvTGFtYmRhID0gbmV3IEZ1bmN0aW9uKHRoaXMsIFwiUHV0VG9kb0xhbWJkYVwiLCB7XG4gICAgICBydW50aW1lOiBSdW50aW1lLk5PREVKU18xNl9YLFxuICAgICAgY29kZTogQ29kZS5mcm9tQXNzZXQoXCJmdW5jdGlvbnNcIiksXG4gICAgICBoYW5kbGVyOiBcInB1dC10b2RvLnB1dFRvZG9zSGFuZGxlclwiLFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgVE9ET19UQUJMRV9OQU1FOiB0b2RvVGFibGUudGFibGVOYW1lLFxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdG9kb1RhYmxlLmdyYW50UmVhZFdyaXRlRGF0YShwdXRUb2RvTGFtYmRhKVxuXG5cbiAgICBjb25zdCBhcGkgPSBuZXcgUmVzdEFwaSh0aGlzLCBcInRvZG8tYXBpXCIpO1xuICAgIGFwaS5yb290LnJlc291cmNlRm9yUGF0aChcInRvZG9cIikuYWRkTWV0aG9kKFwiR0VUXCIsIG5ldyBMYW1iZGFJbnRlZ3JhdGlvbihnZXRBbGxUb2Rvc0xhbWJkYSkpXG4gICAgYXBpLnJvb3QucmVzb3VyY2VGb3JQYXRoKFwidG9kb1wiKS5hZGRNZXRob2QoXCJQT1NUXCIsIG5ldyBMYW1iZGFJbnRlZ3JhdGlvbihwdXRUb2RvTGFtYmRhKSlcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsXCJBUEktVVJMXCIsIHtcbiAgICAgIHZhbHVlOiBhcGkudXJsID8/IFwiU29tZXRoaW5nIFdlbnQgV3JvbmdcIlxuICAgIH0pO1xuICB9XG59XG4iXX0=