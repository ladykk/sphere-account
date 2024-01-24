import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ResetPasswordProps {
  name: string;
  expiresDuration: string;
  resetPasswordLink: string;
  contactEmail: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const ResetPasswordEmail = (props: ResetPasswordProps) => {
  return (
    <Html>
      <Head />
      <Preview>SphereAccount reset your password</Preview>
      <Body>
        <Container>
          <Img
            src={`${baseUrl}/static/logo-text-128h.png`}
            width="auto"
            height="56"
            alt="Dropbox"
          />
          <Section>
            <Text>Hi {props.name},</Text>
            <Text>
              To reset your account password click on the following link. Please
              note that reset link will expire in {props.expiresDuration}. If
              you didn't issue a password reset you can safely ignore this
              email.
            </Text>
            <Button href={props.resetPasswordLink}>Change Password</Button>

            <Text>
              If you have any other questions or concerns, please reach out to{" "}
              <Link href={`mailto:${props.contactEmail}`}>
                {props.contactEmail}
              </Link>
              .
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

ResetPasswordEmail.PreviewProps = {
  name: "Alan",
  expiresDuration: "1 hours",
  resetPasswordLink: baseUrl,
  contactEmail: "acct1.sphere@gmail.com",
} as ResetPasswordProps;

export default ResetPasswordEmail;
