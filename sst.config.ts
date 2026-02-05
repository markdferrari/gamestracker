import type {} from "./.sst/platform/config.d.ts";

export default $config({
  app(input) {
    return {
      name: "gamestracker",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          region: "us-east-1",
          profile: "sst-production"
        },
      },
    };
  },
  async run() {
    const certificateArn = "arn:aws:acm:us-east-1:632700996244:certificate/15b3fa06-9db9-440e-8164-f8cd8b910efc"
    const zoneId = "Z01083643VX0XZEEC21MK"

    const site = new sst.aws.Nextjs("GameTracker", {
      domain: {
        name: "www.whencaniplayit.com",
        dns: sst.aws.dns({
          zone: zoneId,
        }),
        cert: certificateArn,
      },
      environment: {
        IGDB_CLIENT_ID: process.env.IGDB_CLIENT_ID!,
        IGDB_CLIENT_SECRET: process.env.IGDB_CLIENT_SECRET!,
      },
    });

    // Add public access permission to server Lambda function URL
    if (site.nodes.server) {
      new aws.lambda.Permission("ServerUrlPermission", {
        action: "lambda:InvokeFunctionUrl",
        function: site.nodes.server.name,
        principal: "*",
        functionUrlAuthType: "NONE",
      });
      new aws.lambda.Permission("ApiPermission", {
        action: "lambda:InvokeFunction",
        function: site.nodes.server.name,
        principal: "*",
      });
    }
  },
});
