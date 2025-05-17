import { Construct } from 'constructs';
import {
  App,
  TerraformStack,
  S3Backend,
  AssetType,
  TerraformAsset,
} from 'cdktf';
import { AwsProvider } from './.gen/providers/aws/provider';
import { CognitoUserPool } from './.gen/providers/aws/cognito-user-pool';
import { LambdaFunction } from './.gen/providers/aws/lambda-function';
import { IamRole } from './.gen/providers/aws/iam-role';
import { IamPolicyAttachment } from './.gen/providers/aws/iam-policy-attachment';
import { Apigatewayv2Api } from './.gen/providers/aws/apigatewayv2-api';
import { Apigatewayv2Integration } from './.gen/providers/aws/apigatewayv2-integration';
import { Apigatewayv2Route } from './.gen/providers/aws/apigatewayv2-route';
import { Apigatewayv2Stage } from './.gen/providers/aws/apigatewayv2-stage';
import { LambdaPermission } from './.gen/providers/aws/lambda-permission';
import { OpensearchDomain } from './.gen/providers/aws/opensearch-domain';
import * as path from 'path';

class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const region = 'us-east-1'; // Define region once

    new AwsProvider(this, 'aws', {
      region: region,
    });

    new S3Backend(this, {
      bucket: 'my-tf-state-bucket-placeholder',
      key: 'terraform.tfstate',
      region: region,
      dynamodbTable: 'my-tf-lock-table-placeholder',
      encrypt: true,
    });

    new CognitoUserPool(this, 'myUserPool', {
      name: 'my-app-user-pool',
      autoVerifiedAttributes: ['email'],
    });

    // IAM Role for Lambda
    const lambdaRole = new IamRole(this, 'lambdaExecRole', {
      name: 'my-app-lambda-exec-role',
      assumeRolePolicy: JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'lambda.amazonaws.com',
            },
          },
        ],
      }),
    });

    new IamPolicyAttachment(this, 'lambdaBasicExecution', {
      name: 'lambda-basic-execution-attachment',
      policyArn:
        'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
      roles: [lambdaRole.name],
    });

    // Lambda Function (Hello World)
    const helloWorldLambdaAsset = new TerraformAsset(
      this,
      'helloWorldLambdaAsset',
      {
        path: path.join(__dirname, 'assets', 'lambda', 'hello-world'), // Assumes a lambda directory
        type: AssetType.ARCHIVE, // zips the directory
      },
    );

    const helloLambda = new LambdaFunction(this, 'helloLambda', {
      functionName: 'my-app-hello-world',
      role: lambdaRole.arn,
      handler: 'index.handler', // Assumes index.js with handler function
      runtime: 'nodejs18.x',
      filename: helloWorldLambdaAsset.path, // Path to the zipped asset
      sourceCodeHash: helloWorldLambdaAsset.assetHash,
    });

    // API Gateway (HTTP API)
    const httpApi = new Apigatewayv2Api(this, 'myHttpApi', {
      name: 'my-app-http-api',
      protocolType: 'HTTP',
    });

    const lambdaIntegration = new Apigatewayv2Integration(
      this,
      'helloLambdaIntegration',
      {
        apiId: httpApi.id,
        integrationType: 'AWS_PROXY',
        integrationUri: helloLambda.arn,
        payloadFormatVersion: '2.0',
      },
    );

    new Apigatewayv2Route(this, 'helloRoute', {
      apiId: httpApi.id,
      routeKey: 'GET /hello',
      target: `integrations/${lambdaIntegration.id}`,
    });

    new Apigatewayv2Stage(this, 'defaultStage', {
      apiId: httpApi.id,
      name: '$default',
      autoDeploy: true,
    });

    new LambdaPermission(this, 'apiGatewayPermission', {
      statementId: 'AllowAPIGatewayInvoke',
      action: 'lambda:InvokeFunction',
      functionName: helloLambda.functionName,
      principal: 'apigateway.amazonaws.com',
      sourceArn: `${httpApi.executionArn}/*/*`,
    });

    // OpenSearch Domain
    new OpensearchDomain(this, 'myOpenSearchDomain', {
      domainName: 'my-app-opensearch-domain',
      engineVersion: 'OpenSearch_2.5', // Specify a valid version
      clusterConfig: {
        instanceType: 't3.small.search', // Choose an appropriate instance type
      },
      ebsOptions: {
        ebsEnabled: true,
        volumeSize: 10,
      },
      // Add other configurations like VPC options, access policies, etc., as needed
    });

    // define other resources here (e.g. OpenSearch)
  }
}

const app = new App();
new MyStack(app, 'infra');
app.synth();
