/**
 * Clipboard helper.
 *
 * Replaces the copy-pasted (three times!) "Clipboard API + hidden textarea"
 * fallback block. The textarea fallback is still required for non-secure
 * contexts (http://) and older browsers.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        }
        throw new Error('Clipboard API unavailable');
    } catch {
        return legacyCopy(text);
    }
}

function legacyCopy(text: string): boolean {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    // Visible to the DOM (required for selection) but off-screen.
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        return document.execCommand('copy');
    } catch {
        return false;
    } finally {
        document.body.removeChild(textArea);
    }
}
