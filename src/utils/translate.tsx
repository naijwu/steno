export async function translate(blob: Blob) {
    const formData = new FormData();
    const file = new File([blob], "audio.webm", { type: "webm/audio" });

    formData.append("model", "whisper-1");
    formData.append("file", file);

    const response = await fetch(
    `https://api.openai.com/v1/audio/translations`,
    {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_KEY}`,
        },
        body: formData,
    }
    );
    const data = await response.json();
    return data.text;
}

export async function translateGoogle(text: string) {
    // /v3/{parent=projects/*}:translateText
    const res = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${process.env.NEXT_PUBLIC_GOOGLE_KEY}`, {
        method: 'POST',
        body: JSON.stringify({
            "q": text,
            "target": "en"
        })
    });
    const data = await res.json();
    return data.data.translations[0].translatedText || null;
}