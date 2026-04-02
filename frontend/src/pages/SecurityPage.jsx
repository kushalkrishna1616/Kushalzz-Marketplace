export default function SecurityPage() {
  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-28">
        <p className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-[0.4em] mb-6">Privacy & Law</p>
        <h1 className="text-4xl md:text-6xl font-light text-slate-900 tracking-tight mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          Cyber Sanctuary
        </h1>
        <p className="text-sm text-gray-400 mb-16 font-medium">Last updated: April 2026</p>

        <div className="space-y-12 text-gray-600" style={{ fontFamily: "'Jost', sans-serif" }}>
          {[
            {
              title: "1. Our Security Commitment",
              body: "Kushalzz Marketplace is architected with security at its core. We employ industry-standard practices to protect your personal information and financial data at every layer of our infrastructure."
            },
            {
              title: "2. Data Encryption",
              body: "All data transmitted between your device and our servers is encrypted using TLS 1.3. Passwords are hashed using bcrypt with adaptive salting. Payment data is never stored on our servers and is processed exclusively through certified payment gateways."
            },
            {
              title: "3. Account Security",
              body: "We strongly recommend enabling two-factor authentication on your account. Use a unique, strong password for your Kushalzz account. Our system will alert you of any unrecognized login attempts."
            },
            {
              title: "4. Payment Security",
              body: "All payment transactions are processed through PCI-DSS compliant gateways. We do not store card numbers or CVV details. Every transaction is cryptographically signed and verified server-side before fulfillment."
            },
            {
              title: "5. Responsible Disclosure",
              body: "If you discover a security vulnerability in our platform, we kindly request that you report it responsibly to security@kushalzz-marketplace.com. We appreciate your help in keeping our community safe."
            },
            {
              title: "6. Incident Response",
              body: "In the unlikely event of a data breach, we will notify affected users within 72 hours and take immediate remediation action. We maintain a dedicated security incident response team available around the clock."
            },
          ].map((section) => (
            <div key={section.title} className="border-b border-gray-100 pb-10">
              <h2 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-wide">{section.title}</h2>
              <p className="text-sm leading-relaxed font-light">{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
