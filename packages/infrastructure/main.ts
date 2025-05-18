import { Construct } from 'constructs';
import {
  App,
  S3Backend,
  AssetType,
  TerraformAsset,
  TerraformOutput,
} from 'cdktf';
import { AwsProvider } from './.gen/providers/aws/provider';
import { LambdaFunction } from './.gen/providers/aws/lambda-function';
import { IamRole } from './.gen/providers/aws/iam-role';
import { IamPolicyAttachment } from './.gen/providers/aws/iam-policy-attachment';
import { Apigatewayv2Api } from './.gen/providers/aws/apigatewayv2-api';
import { Apigatewayv2Integration } from './.gen/providers/aws/apigatewayv2-integration';
import { Apigatewayv2Route } from './.gen/providers/aws/apigatewayv2-route';
import { Apigatewayv2Stage } from './.gen/providers/aws/apigatewayv2-stage';
import { LambdaPermission } from './.gen/providers/aws/lambda-permission';
import { OpensearchDomain } from './.gen/providers/aws/opensearch-domain';
import { SsmParameter } from './.gen/providers/aws/ssm-parameter';
import { DataAwsSsmParameter } from './.gen/providers/aws/data-aws-ssm-parameter';
import * as path from 'path';

import { NetworkStack } from './network-stack/main';
import { AuthStack } from './auth-stack/main';

// Define a common config interface if parameters are passed from here
interface AppConfig {
  region: string;
  envName: string; // e.g. dev, prod
  vpcCidrBlock: string;
  publicSubnetCidrBlock: string;
  availabilityZone: string;
  userPoolName: string;
}

// Example configuration - this could come from context or a config file
const appConfig: AppConfig = {
  region: 'ap-southeast-1', // Default region
  envName: 'dev',
  vpcCidrBlock: '10.0.0.0/16',
  publicSubnetCidrBlock: '10.0.1.0/24',
  availabilityZone: 'ap-southeast-1a', // Choose an appropriate AZ
  userPoolName: 'app-base-kit-user-pool-main',
};

class MyExistingStuffStack extends Construct {
  // Changed to Construct, as App will manage stacks
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // AwsProvider is instantiated in each stack now, or could be passed if shared
    // This MyExistingStuffStack assumes provider is handled by the individual stacks or a parent App construct

    // IAM Role for Lambda
    const lambdaRole = new IamRole(this, 'lambdaExecRole', {
      name: `app-base-kit-${appConfig.envName}-lambda-exec-role`,
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
      name: `lambda-basic-execution-attachment-${appConfig.envName}`,
      policyArn:
        'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
      roles: [lambdaRole.name!], // Added non-null assertion
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
      functionName: `app-base-kit-${appConfig.envName}-hello-world`,
      role: lambdaRole.arn,
      handler: 'index.handler', // Assumes index.js with handler function
      runtime: 'nodejs18.x',
      filename: helloWorldLambdaAsset.path, // Path to the zipped asset
      sourceCodeHash: helloWorldLambdaAsset.assetHash,
    });

    // API Gateway (HTTP API)
    const httpApi = new Apigatewayv2Api(this, 'myHttpApi', {
      name: `app-base-kit-${appConfig.envName}-http-api`,
      protocolType: 'HTTP',
    });

    const lambdaIntegrationId = new Apigatewayv2Integration(
      this,
      'helloLambdaIntegration',
      {
        apiId: httpApi.id,
        integrationType: 'AWS_PROXY',
        integrationUri: helloLambda.arn,
        payloadFormatVersion: '2.0',
      },
    ).id;

    new Apigatewayv2Route(this, 'helloRoute', {
      apiId: httpApi.id,
      routeKey: 'GET /hello',
      target: `integrations/${lambdaIntegrationId}`,
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
      sourceArn: `$\{httpApi.executionArn}/*/*`,
    });

    // OpenSearch Domain
    new OpensearchDomain(this, 'myOpenSearchDomain', {
      domainName: `app-base-kit-${appConfig.envName}-opensearch-domain`,
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

    // SSM Parameter Example: Creating a new parameter
    new SsmParameter(this, 'myAppParameter', {
      name: `/app-base-kit/${appConfig.envName}/config/api-endpoint`,
      type: 'String',
      value: httpApi.apiEndpoint,
      tags: {
        Environment: appConfig.envName,
      },
    });

    // SSM Parameter Example: Reading an existing parameter
    const existingParameter = new DataAwsSsmParameter(
      this,
      'existingSsmParameter',
      {
        name: `/app-base-kit/${appConfig.envName}/config/example-db-password`,
      },
    );

    new TerraformOutput(this, 'retrievedSsmParameterValue', {
      value: existingParameter.value,
      description: 'Value of the SSM parameter read via DataAwsSsmParameter',
    });
  }
}

const app = new App();

// S3 Backend configuration (remains at the App level or per stack if needed)
// It's often defined once if all stacks go to the same backend.
// For this example, let's assume a shared backend config at the App level is desired.
// If NetworkStack or AuthStack need their own backend, configure it within them.
new S3Backend(app, {
  // Assuming 'app' can be a scope for S3Backend, or use one of the stacks
  bucket: `app-base-kit-tfstate-594239945745-${appConfig.region}`,
  key: 'terraform.tfstate', // Consider prefixing with stack name if backend is per stack
  region: appConfig.region,
  profile: 'base-kit', // This should ideally be configured via AWS provider or env vars
  dynamodbTable: 'app-base-kit-tf-lock-table',
  encrypt: true,
});

// Instantiate the new stacks
new NetworkStack(app, 'network-stack', {
  region: appConfig.region,
  vpcCidrBlock: appConfig.vpcCidrBlock,
  publicSubnetCidrBlock: appConfig.publicSubnetCidrBlock,
  availabilityZone: appConfig.availabilityZone,
});

new AuthStack(app, 'auth-stack', {
  region: appConfig.region,
  userPoolName: appConfig.userPoolName,
});

// Instantiate the existing resources, now potentially as a separate construct within the app
// Note: MyExistingStuffStack is now just a Construct. If it needs to be a TerraformStack, it needs its own provider setup.
// For simplicity, keeping it as a construct and assuming provider is handled by the App's stacks or globally.
// However, typically, resources that need a provider would be in a TerraformStack.
// Let's assume for now that 'MyExistingStuffStack' resources are fine within the 'app' scope.
// A better approach would be to make MyExistingStuffStack a TerraformStack as well, or integrate its resources into other stacks.

// The original `MyStack` content will be wrapped or its resources moved.
// For now, let's create an instance of MyExistingStuffStack to keep its resources.
// This part might need further refinement based on how resources should be grouped into stacks.
new AwsProvider(app, 'aws-provider-for-existing-stuff', {
  // Need a provider for existing stuff if it's not in its own stack
  region: appConfig.region,
  profile: 'base-kit', // Consistent profile usage
});
new MyExistingStuffStack(app, 'existing-infra');

app.synth();
