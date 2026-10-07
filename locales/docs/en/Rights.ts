export class Rights {
    static get title() {
        return 'Rights Holders';
    }

    static get content() {
        return `
        <h3 class="text-xl font-bold text-white mb-4">Rights Holders</h3>
        <p class="mb-4"><strong>CineNetwork</strong> online cinema respects copyright and related rights and is committed to complying with applicable intellectual property laws, including regulations in force in the Commonwealth of Independent States (CIS), the European Union, and the United States of America.</p>
        <p class="mb-4">Content on the platform may be posted by both CineNetwork administration and registered users. We may not always know in advance that a particular material infringes upon someone's exclusive rights.</p>
        
        <p class="mb-4">If you have discovered content on our site that you believe violates your copyright, please inform us by sending an official notification to:<br/>
        <strong>copyright@cinenetwork.space</strong></p>

        <p class="mb-4">For your request to be considered on a priority basis and to have legal force, it must contain the following information:</p>

        <ol class="list-decimal pl-5 space-y-4 mb-6 text-gray-300">
            <li>
                <strong>Applicant Contact Details</strong>:<br/>
                — Full name or full name of the organization;<br/>
                — Email address and/or phone number for feedback;<br/>
                — Legal address (for legal entities).
            </li>
            <li>
                <strong>Proof of Your Rights</strong>:<br/>
                — Indication of the work for which you hold exclusive rights (title, year of release, authors, rights holder);<br/>
                — If available — details of documents confirming your rights (e.g., license agreement, registration certificate, power of attorney).<br/>
                If you are acting on behalf of the rights holder, please attach a copy of the document confirming your authority.
            </li>
            <li>
                <strong>Identification of Infringing Content</strong>:<br/>
                — Direct link (URL) to the page with the material that you believe infringes your rights;<br/>
                — Additionally: video title, uploader username, publication date (if known).
            </li>
            <li>
                <strong>Statement of Good Faith and Accuracy</strong>:<br/>
                — Confirmation that you have a good faith belief that the use of the specified content is unauthorized;<br/>
                — Assurance that all information in the notification is accurate;<br/>
                — Statement of readiness to bear responsibility for possible consequences of a false notification, including compensation for damages to third parties.
            </li>
            <li>
                <strong>(Recommended for EU) Technical Content Identification</strong>:<br/>
                — File hash sum (MD5, SHA-256, etc.);<br/>
                — Unique metadata, watermarks, or other identifiers allowing unambiguous recognition of the content.<br/>
                Providing this information will help us more effectively prevent repeated infringements.
            </li>
        </ol>

        <p class="mb-4">All notifications are reviewed by our legal department within <strong>5 business days</strong>. In case of confirmed infringement, access to the disputed content will be restricted or removed as soon as possible.</p>
        <p class="mb-4">We also provide an appeal mechanism for users whose content has been removed. Any moderation decision may be reviewed upon provision of additional evidence.</p>
        <p class="mb-6">We highly appreciate your cooperation in ensuring copyright compliance.</p>

        <div class="mt-12 text-center border-t border-white/10 pt-8 flex flex-col items-center justify-center gap-2">
            <p class="font-bold text-white text-lg !m-0">Thank you for choosing CineNetwork!</p>
            <p class="text-gray-400 italic text-sm !m-0">Enjoy movies — safely, legally, and without borders.</p>
        </div>
        `;
    }
}