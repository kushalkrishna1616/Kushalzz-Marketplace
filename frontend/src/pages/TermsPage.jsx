export default function TermsPage() {
  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-28">
        <p className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-[0.4em] mb-6">Privacy & Law</p>
        <h1 className="text-4xl md:text-6xl font-light text-slate-900 tracking-tight mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          Terms of Service
        </h1>
        <p className="text-sm text-gray-400 mb-16 font-medium">Last updated: April 2026</p>

        <div className="space-y-12 text-gray-600" style={{ fontFamily: "'Jost', sans-serif" }}>
          {[
            {
              title: "1. Acceptance of Terms",
              body: "By accessing or using Kushalzz Marketplace, you agree to be bound by these Terms of Service. If you do not agree to all terms and conditions, please do not use our platform."
            },
            {
              title: "2. Account Responsibility",
              body: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately of any unauthorized access."
            },
            {
              title: "3. Product Listings & Pricing",
              body: "We strive to ensure all product descriptions, images, and prices are accurate. However, errors may occasionally occur. We reserve the right to cancel orders placed for incorrectly priced or described items."
            },
            {
              title: "4. Orders & Payments",
              body: "Placing an order constitutes an offer to purchase. Orders are confirmed upon payment success. We reserve the right to refuse or cancel any order at our discretion, with a full refund issued."
            },
            {
              title: "5. Returns & Exchanges",
              body: "Items may be returned or exchanged within 7 days of delivery, provided they are unused, unwashed, and in original packaging. Final sale items are not eligible for returns."
            },
            {
              title: "6. Prohibited Activities",
              body: "You may not use our platform for unlawful purposes, attempt to gain unauthorized access to any part of our systems, or engage in any activity that disrupts the integrity of our services."
            },
            {
              title: "7. Limitation of Liability",
              body: "Kushalzz Marketplace shall not be liable for indirect, incidental, or consequential damages arising from your use of our platform. Our total liability shall not exceed the value of your most recent transaction."
            },
            {
              title: "8. Governing Law",
              body: "These terms are governed by the laws of India. Disputes shall be subject to the exclusive jurisdiction of courts in Bengaluru, Karnataka."
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
