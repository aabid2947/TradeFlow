// src/pages/ErrorPage.jsx
import { LoginForm } from "../components/LoginForm";
import TypeformSignup from "../components/TypeformSignup";
export default function LoginPage() {


  return (
     <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="hidden lg:block">
            <TypeformSignup />
          </div>
          <div>
            <LoginForm />
          </div>
        </div>
  );
}
