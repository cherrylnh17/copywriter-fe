import TokenLogin from "@/components/TokenLogin";

export default function StudioLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <TokenLogin>{children}</TokenLogin>
    </div>
  );
}
