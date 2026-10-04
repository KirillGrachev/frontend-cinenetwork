export class FAQ {
    static get title() {
        return 'FAQ';
    }

    static get content() {
        return `
        <h3 class="text-xl font-bold text-white mb-4">Frequently Asked Questions (FAQ)</h3>
        
        <p class="mb-6 text-gray-400">In this section, we have collected answers to the most popular questions arising from users of our service.</p>

        <div class="space-y-6">
            <div class="bg-white/5 rounded-2xl p-6 border border-white/5">
                <h4 class="font-bold text-white text-lg mb-2">Information is being updated</h4>
                <p class="text-gray-400 text-sm">We are working on filling this section. If you have an urgent question, please contact support via the corresponding section in the menu.</p>
            </div>
        </div>

        <div class="mt-12 text-center border-t border-white/10 pt-8 flex flex-col items-center justify-center gap-2">
            <p class="font-bold text-white text-lg !m-0">Thank you for choosing CineNetwork!</p>
            <p class="text-gray-400 italic text-sm !m-0">Enjoy movies — safely, legally, and without borders.</p>
        </div>
        `;
    }
}
