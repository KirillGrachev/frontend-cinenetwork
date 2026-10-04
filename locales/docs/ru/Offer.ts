export class Offer {
    static get title() {
        return 'Публичная оферта';
    }

    static get content() {
        return `<p>Настоящий документ является официальным предложением (публичной офертой) CineNetwork LLC.</p>
        <p>Акцептом оферты является оплата подписки или регистрация на сайте.</p>
        
        <div class="mt-8 pt-8 pb-8 text-center border-t border-white/10 flex flex-col gap-2">
            <p class="font-bold text-white text-lg">Спасибо, что выбираете CineNetwork!</p>
            <p class="text-gray-400 italic">Наслаждайтесь кино — безопасно, легально и без границ.</p>
        </div>
        `;
    }
}
