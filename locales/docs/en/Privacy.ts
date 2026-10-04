export class Privacy {
    static get title() {
        return 'Privacy Policy';
    }

    static get content() {
        return `
        <h3 class="text-xl font-bold text-white mb-4">Privacy Policy of CineNetwork Online Cinema</h3>
        <p class="mb-6"><strong>Effective Date:</strong> February 1, 2026</p>
        <p class="mb-4">This Privacy Policy (hereinafter referred to as the "Policy") governs the collection, use, storage, protection, and disclosure of personal data of users of the CineNetwork online cinema (hereinafter referred to as the "Service", "we", "us", or "CineNetwork"), available at cinenetwork.space, as well as through mobile applications and other platforms owned or operated by us.</p>
        <p class="mb-4">We respect your right to privacy and are committed to protecting your personal data in accordance with applicable law, including Federal Law No. 152-FZ "On Personal Data" (Russia and CIS countries), the General Data Protection Regulation (GDPR, European Union), and the California Consumer Privacy Act (CCPA/CPRA, USA).</p>
        <div class="bg-red-500/10 border-l-4 border-red-500 p-4 my-6">
            <p class="text-sm text-red-200"><strong>If you do not agree to the terms of this Policy, please refrain from using the Service.</strong></p>
        </div>

        <h4 class="text-lg font-bold text-white mt-8 mb-4">1. Who is the data controller?</h4>
        <p>The controller of personal data collected and processed within the scope of using the CineNetwork Service is:</p>
        <div class="bg-white/5 p-4 rounded-xl border border-white/10 my-4">
            <p><strong>Address:</strong> [Empty]</p>
            <p><strong>Contact email for data protection inquiries:</strong> privacy@cinenetwork.space</p>
        </div>

        <h4 class="text-lg font-bold text-white mt-8 mb-4">2. What data do we collect and why?</h4>
        <p class="mb-2">We collect and process only the personal data that is necessary to provide, improve, and protect our services. We adhere to the principle of data minimization.</p>
        
        <p class="font-bold text-white mt-4 mb-2">2.1. Data provided directly by you:</p>
        <ul class="list-disc pl-5 space-y-2 mb-4 text-gray-300">
            <li><strong>Contact Information:</strong> Email address, name (upon registration).</li>
            <li><strong>Age Verification Data:</strong> Date of birth (used solely to determine access to age-restricted content in accordance with the law).</li>
            <li><strong>Payment Information:</strong> When subscribing or purchasing content, you will be redirected to a secure payment platform of our partners (e.g., Stripe, PayPal, etc.). <strong>CineNetwork does not store or process your full bank details (card number, CVV).</strong> We only receive confirmation of a successful payment and information necessary to manage your subscription.</li>
        </ul>

        <p class="font-bold text-white mt-4 mb-2">2.2. Data collected automatically:</p>
        <ul class="list-disc pl-5 space-y-2 mb-4 text-gray-300">
            <li><strong>Technical Information:</strong> IP address, browser type and version, operating system, device model, unique device identifiers.</li>
            <li><strong>Usage Data:</strong> Viewing history, ratings and reviews of movies/series, viewing duration, catalog search, download and playback information.</li>
            <li><strong>Cookies and Similar Technologies:</strong> We use cookies and other technologies to ensure the operation of the site, analyze traffic, personalize content, and show relevant advertising. You can manage your cookie preferences through your browser settings or using our Cookie Banner.</li>
        </ul>

        <p class="font-bold text-white mt-4 mb-2">2.3. Purposes of processing your data:</p>
        <p class="mb-2">We process your personal data for the following purposes:</p>
        <ul class="list-disc pl-5 space-y-2 mb-4 text-gray-300">
            <li><strong>Service Provision:</strong> Registration and management of your account, providing access to requested movies and series, processing subscriptions and payments.</li>
            <li><strong>Personalization:</strong> Generating recommendations based on your viewing history and preferences.</li>
            <li><strong>Legal Compliance:</strong> Ensuring compliance with age restrictions on content, fulfilling tax and other legal obligations.</li>
            <li><strong>Service Improvement:</strong> Analyzing usage to improve performance, interface, and content quality.</li>
            <li><strong>Security:</strong> Protecting the Service and its users from fraud, hacking, and other unlawful actions.</li>
            <li><strong>Marketing (only with your consent):</strong> Sending news, special offers, and information about new releases. You can always unsubscribe from such mailings.</li>
        </ul>

        <h4 class="text-lg font-bold text-white mt-8 mb-4">3. What is our legal basis for processing your data?</h4>
        <p class="mb-2">Our legal basis for processing depends on the specific purpose and your jurisdiction:</p>
        <ul class="list-disc pl-5 space-y-2 mb-4 text-gray-300">
            <li><strong>Contract Performance:</strong> To provide you with access to content and manage your subscription.</li>
            <li><strong>Legal Compliance:</strong> To comply with tax laws and regulations governing media distribution.</li>
            <li><strong>Legitimate Interests:</strong> For analytics and improving our service, provided that our interests do not override your privacy rights.</li>
            <li><strong>Your Consent:</strong> For marketing communications and the use of non-essential cookies. You have the right to withdraw your consent at any time.</li>
        </ul>

        <h4 class="text-lg font-bold text-white mt-8 mb-4">4. Who do we share your data with?</h4>
        <p class="mb-4">We do not sell your personal data to third parties.</p>
        <p class="mb-2">We may share your data with the following categories of recipients:</p>
        <ul class="list-disc pl-5 space-y-2 mb-4 text-gray-300">
            <li><strong>Payment Providers:</strong> Solely for processing your payments.</li>
            <li><strong>Service Providers:</strong> Companies that help us with hosting, analytics, technical support, and marketing (only on our behalf and under strict confidentiality agreements).</li>
            <li><strong>Law Enforcement Agencies:</strong> Only in cases explicitly provided for by law, based on an official request or court order.</li>
        </ul>

        <h4 class="text-lg font-bold text-white mt-8 mb-4">5. Cross-Border Data Transfer</h4>
        <p>Your data may be transferred to and processed on servers located outside your country of residence, including countries that may have different data protection standards. We guarantee that such transfer is carried out in accordance with applicable law, including the use of Standard Contractual Clauses (SCCs) or other approved protection mechanisms ensuring an adequate level of security.</p>

        <h4 class="text-lg font-bold text-white mt-8 mb-4">6. Your Rights</h4>
        <p class="mb-2">You have the right to control your personal data. Depending on your jurisdiction, you may:</p>
        <ul class="list-disc pl-5 space-y-2 mb-4 text-gray-300">
            <li>Request access to your data.</li>
            <li>Request correction of inaccurate data.</li>
            <li>Request deletion of your data ("right to be forgotten").</li>
            <li>Restrict the processing of your data.</li>
            <li>Receive your data in a structured, commonly used, and machine-readable format and transmit it to another controller (right to data portability).</li>
            <li>Withdraw your consent to processing (this will not affect the lawfulness of processing carried out before the withdrawal).</li>
            <li>Object to the processing of your data based on legitimate interests.</li>
            <li>Opt-out of the "sale" or "sharing" of your data (under CCPA/CPRA).</li>
        </ul>
        <p>To exercise your rights, you can send a request to our data protection email: <strong>privacy@cinenetwork.space</strong>. We will respond to your request within 30 days.</p>

        <h4 class="text-lg font-bold text-white mt-8 mb-4">7. Children's Data Protection</h4>
        <p>The CineNetwork Service is intended for users over **13 years old**. We do not knowingly collect personal data from children under this age. If you become aware that a child has provided us with their data without parental or guardian consent, please contact us, and we will immediately delete this information.</p>

        <h4 class="text-lg font-bold text-white mt-8 mb-4">8. Data Security</h4>
        <p>We implement modern technical and organizational measures to protect your personal data from unauthorized access, disclosure, alteration, or destruction. This includes data encryption, access control, and regular security audits.</p>

        <h4 class="text-lg font-bold text-white mt-8 mb-4">9. Changes to the Policy</h4>
        <p>We reserve the right to update this Privacy Policy. All changes will be posted on this page with the new effective date. We recommend that you check this page periodically.</p>

        <h4 class="text-lg font-bold text-white mt-8 mb-4">10. Contact Us</h4>
        <p>If you have any questions, comments, or requests regarding this Privacy Policy or the processing of your personal data, please contact us:</p>
        <div class="bg-white/5 p-4 rounded-xl border border-white/10 my-4">
            <p><strong>Email:</strong> privacy@cinenetwork.space</p>
        </div>

        <div class="mt-12 text-center border-t border-white/10 pt-8 flex flex-col items-center justify-center gap-2">
            <p class="font-bold text-white text-lg !m-0">Thank you for choosing CineNetwork!</p>
            <p class="text-gray-400 italic text-sm !m-0">Enjoy movies — safely, legally, and without borders.</p>
        </div>
        `;
    }
}
