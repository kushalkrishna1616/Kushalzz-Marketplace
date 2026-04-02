export default function PrivacyPage() {
  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-28">
        <p className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-[0.4em] mb-6">Privacy & Law</p>
        <h1 className="text-4xl md:text-6xl font-light text-slate-900 tracking-tight mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          Privacy Charter
        </h1>
        <p className="text-sm text-gray-400 mb-16 font-medium">Last updated: April 2026</p>

        <div className="space-y-12 text-gray-600" style={{ fontFamily: "'Jost', sans-serif" }}>
          {[
            {
              title: "1. Information We Collect",
              body: "We collect information you provide directly to us — such as your name, email address, phone number, and delivery addresses — when you create an account, place an order, or contact us. We also collect data automatically through your interactions with our platform, including browsing activity, device information, and purchase history."
            },
            {
              title: "2. How We Use Your Information",
              body: "Your information is used exclusively to process and deliver your orders, personalize your shopping experience, send transactional communications, and improve our services. We do not sell your personal data to any third party under any circumstances."
            },
            {
              title: "3. Data Sharing",
              body: "We may share your data with trusted logistics partners solely for order fulfillment, and with payment processors to complete transactions securely. All partners are contractually bound to confidentiality and data protection standards equivalent to our own."
            },
            {
              title: "4. Cookies & Tracking",
              body: "Kushalzz Marketplace uses cookies to remember your preferences and improve your experience. You can control cookie settings through your browser. Disabling cookies may affect certain features of our platform."
            },
            {
              title: "5. Data Retention",
              body: "We retain your personal data for as long as your account is active or as required by law. You may request deletion of your account and associated data at any time by contacting our support team."
            },
            {
              title: "6. Your Rights",
              body: "You have the right to access, correct, or delete your personal data. You may also withdraw consent for marketing communications at any time. Submit such requests to our Boutique Concierge team."
            },
            {
              title: "7. Contact",
              body: "For privacy-related concerns, contact us at privacy@kushalzz-marketplace.com. We will respond within 5 business days."
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
