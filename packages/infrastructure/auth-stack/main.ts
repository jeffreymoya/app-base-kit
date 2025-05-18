import { Construct } from 'constructs';
import { TerraformStack } from 'cdktf';
import { AwsProvider, cognitoUserPool } from '@cdktf/provider-aws';

interface AuthStackConfig {
  region: string;
  userPoolName: string;
}

export class AuthStack extends TerraformStack {
  constructor(scope: Construct, id: string, config: AuthStackConfig) {
    super(scope, id);

    new AwsProvider(this, 'aws', {
      region: config.region,
    });

    new cognitoUserPool.CognitoUserPool(this, 'userPool', {
      name: config.userPoolName,
      passwordPolicy: {
        minimumLength: 8,
        requireLowercase: true,
        requireNumbers: true,
        requireSymbols: true,
        requireUppercase: true,
      },
      autoVerifiedAttributes: ['email'],
      schema: [
        {
          name: 'email',
          attributeDataType: 'String',
          required: true,
          mutable: false,
        },
      ],
      tags: {
        Name: `$\{id}-user-pool`,
      },
    });
  }
}

// Example usage (optional, usually done in the main cdktf entrypoint)
// const app = new App();
// new AuthStack(app, "auth", {
//   region: "us-east-1",
//   userPoolName: "my-app-users"
// });
// app.synth();
