// src/pages/ErrorPage.jsx
import { useRouteError } from "react-router-dom";
import { LoginForm } from "../components/LoginForm";
import { SignUpForm } from "../components/SignupForm";
import TypeformSignup from "../components/TypeformSignup";
export default function SignUpPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
      <div className="hidden lg:block ">
        <TypeformSignup />
      </div>
      <div>
        <SignUpForm />
      </div>
    </div>
  );
}
