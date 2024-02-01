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
} from "jsx-email";
import * as React from "react";

interface ResetPasswordProps {
  name: string;
  expiresDuration: string;
  resetPasswordLink: string;
  contactEmail: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://sphere-account.vercel.app";

export const ResetPasswordEmail = (props: ResetPasswordProps) => {
  return (
    <Html>
      <Head />
      <Preview>SphereAccount reset your password</Preview>
      <Body style={{ fontFamily: "system-ui, sans-serif" }}>
        <Container
          style={{
            padding: "60px",
            border: "1px solid #ccc",
            borderRadius: "45px",
            margin: "20px auto",
          }}
        >
          <Img
            src={`${baseUrl}/static/logo-text-128h.png`}
            width="auto"
            height="56"
            alt="SphereAccount Logo"
            style={{ marginBottom: "20px" }}
          />
          <Section>
            <Text
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "rgb(10, 10, 10)",
              }}
            >
              Hi {props.name},
            </Text>
            <Text
              style={{
                fontSize: "16px",
                color: "rgb(74, 74, 74)",
              }}
            >
              To reset your account password click on the following link. Please
              note that reset link will expire in {props.expiresDuration}. If
              you didn't issue a password reset you can safely ignore this
              email.
            </Text>
            <Button
              href={props.resetPasswordLink}
              style={{
                backgroundColor: "rgb(243, 113, 32)",
                padding: "12px 16px",
                color: "rgb(255, 255, 255)",
                borderRadius: "6px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Change Password
            </Button>

            <Text
              style={{
                fontSize: "16px",
                color: "rgb(74, 74, 74)",
              }}
            >
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
  name: "User",
  expiresDuration: "1 hours",
  resetPasswordLink: baseUrl,
  contactEmail: "acct1.sphere@gmail.com",
} as ResetPasswordProps;

export default ResetPasswordEmail;
