import nodemailer from "nodemailer";
import { google } from "googleapis";
import { env } from "./env";

const g = {
  cid: env.googleClientId,
  cse: env.googleClientSecret,
  ret: env.googleRefreshToken,
  usr: env.googleUser,
};

const oauth2Client = new google.auth.OAuth2({
  clientId: g.cid,
  clientSecret: g.cse,
  redirectUri: "https://developers.google.com/oauthplayground",
});

oauth2Client.setCredentials({
  refresh_token: g.ret,
});

const token = await oauth2Client.getAccessToken();

const transporter = nodemailer.createTransport({
  // @ts-expect-error: it's ok
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: g.usr,
    clientId: g.cid,
    clientSecret: g.cse,
    refreshToken: g.ret,
    accessToken: token.token,
  },
});

export const sendEmail = async ({
  subject,
  text,
  to,
}: {
  to: string;
  subject: string;
  text: string;
}) => {
  await transporter.sendMail({
    from: "Better-Auth",
    to,
    subject,
    text,
  });
};
