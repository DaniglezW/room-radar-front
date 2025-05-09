import AuthForm from '../components/AuthForm';

export default function LoginPage() {
  return (
    <main className="p-6">
      <AuthForm type="login" />
    </main>
  );
}