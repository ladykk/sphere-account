import ResetPasswordComponent from "./_component/resetpassword";
import CheckEmailComponent from "./_component/check-email";
import NewPasswordComponent from "./_component/newpassword";
import SuccessResetPassword from "./_component/success-resetpassword";

export default function page(props: {
  searchParams: {
    token?: string;
  };
}) {
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

  console.log(props.searchParams.token);

  if (props.searchParams.token === undefined) {
    return <ResetPasswordComponent />;
  }
  if (props.searchParams.token !== undefined) {
    return (
      <>
        <NewPasswordComponent />
        <CheckEmailComponent />
      </>
    );
  }
  if ((props.searchParams.token = "success")) {
    return <SuccessResetPassword />;
  }
}
