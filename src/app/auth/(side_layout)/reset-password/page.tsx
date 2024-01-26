import { SendEmailSection } from "./_component/send-email";

// Token - Secret
// Link ใน Email - /auth/reset-password?token=secret

export default function page(props: {
  searchParams: {
    token?: string;
  };
}) {
  const token = props.searchParams.token;

  if (!token) return <SendEmailSection />;
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
