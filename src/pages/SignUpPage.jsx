
import { SignUpForm } from "../components/SignupForm";
import TypeformSignup from "../components/TypeformSignup";
export default function SignUpPage() {


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
