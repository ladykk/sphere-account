import { SendEmailSection } from "./_component/send-email";
import { ChangePassword } from "./_component/change-password";

// Token - Secret
// Link ใน Email - /auth/reset-password?token=secret

export default function page(props: {
  searchParams: {
    token?: string;
  };
}) {
  const token = props.searchParams.token;

  if (!token) return <SendEmailSection />;
  // if (token) return <ChangePassword />;
}

// Destucture
// {
//   searchParams: {
//       token
//     }
// }: {
//   searchParams: {
//     token?:string
//   }
// }
