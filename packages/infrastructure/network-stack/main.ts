import { Construct } from 'constructs';
import { TerraformStack } from 'cdktf';
import {
  AwsProvider,
  vpc,
  subnet,
  internetGateway,
  routeTable,
  routeTableAssociation,
} from '@cdktf/provider-aws';

interface NetworkStackConfig {
  region: string;
  vpcCidrBlock: string;
  publicSubnetCidrBlock: string;
  availabilityZone: string;
}

export class NetworkStack extends TerraformStack {
  constructor(scope: Construct, id: string, config: NetworkStackConfig) {
    super(scope, id);

    new AwsProvider(this, 'aws', {
      region: config.region,
    });

    const vpcResource = new vpc.Vpc(this, 'mainVpc', {
      cidrBlock: config.vpcCidrBlock,
      enableDnsHostnames: true,
      enableDnsSupport: true,
      tags: {
        Name: `$\{id}-vpc`,
      },
    });

    const publicSubnet = new subnet.Subnet(this, 'publicSubnet', {
      vpcId: vpcResource.id,
      cidrBlock: config.publicSubnetCidrBlock,
      availabilityZone: config.availabilityZone,
      mapPublicIpOnLaunch: true,
      tags: {
        Name: `$\{id}-public-subnet`,
      },
    });

    const igw = new internetGateway.InternetGateway(this, 'igw', {
      vpcId: vpcResource.id,
      tags: {
        Name: `$\{id}-igw`,
      },
    });

    const publicRouteTable = new routeTable.RouteTable(
      this,
      'publicRouteTable',
      {
        vpcId: vpcResource.id,
        route: [
          {
            cidrBlock: '0.0.0.0/0',
            gatewayId: igw.id,
          },
        ],
        tags: {
          Name: `$\{id}-public-rt`,
        },
      },
    );

    new routeTableAssociation.RouteTableAssociation(
      this,
      'publicSubnetAssociation',
      {
        subnetId: publicSubnet.id,
        routeTableId: publicRouteTable.id,
      },
    );
  }
}

// Example usage (optional, usually done in the main cdktf entrypoint)
// const app = new App();
// new NetworkStack(app, "network", {
//   region: "us-east-1",
//   vpcCidrBlock: "10.0.0.0/16",
//   publicSubnetCidrBlock: "10.0.1.0/24",
//   availabilityZone: "us-east-1a"
// });
// app.synth();
