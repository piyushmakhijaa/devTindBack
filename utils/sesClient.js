import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({
  region: "eu-north-1", // MUST match SES region
});

export async function sendEmail({ to, subject, body }) {
  const command = new SendEmailCommand({
    Source: "piyushmakhija04@gmail.com", // must be VERIFIED in SES
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: "UTF-8",
      },
      Body: {
        Text: {
          Data: body,
          Charset: "UTF-8",
        },
      },
    },
  });

  const response = await sesClient.send(command);
  console.log("SES Message ID:", response.MessageId);

  return response;
}
