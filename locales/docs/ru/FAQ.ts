export class FAQ {
    static get title() {
        return 'FAQ';
    }

    static get content() {
        return `
        <h3 class="text-xl font-bold text-white mb-4">Часто задаваемые вопросы (FAQ)</h3>
        
        <p class="mb-6 text-gray-400">В данном разделе мы собрали ответы на самые популярные вопросы, возникающие у пользователей нашего сервиса.</p>

        <div class="space-y-6">
            <div class="bg-white/5 rounded-2xl p-6 border border-white/5">
                <h4 class="font-bold text-white text-lg mb-2">Информация обновляется</h4>
                <p class="text-gray-400 text-sm">Мы работаем над наполнением этого раздела. Если у вас есть срочный вопрос, пожалуйста, обратитесь в службу поддержки через соответствующий раздел в меню.</p>
            </div>
        </div>

        <div class="mt-12 text-center border-t border-white/10 pt-8 flex flex-col items-center justify-center gap-2">
            <p class="font-bold text-white text-lg !m-0">Спасибо, что выбираете CineNetwork!</p>
            <p class="text-gray-400 italic text-sm !m-0">Наслаждайтесь кино — безопасно, легально и без границ.</p>
        </div>
        `;
    }
}