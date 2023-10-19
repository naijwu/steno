const typeToExt: any = {
    'audio/webm': 'webm',
    'audio/mp4': 'mp4'
}

export async function transcribe(blob: Blob) {
    const formData = new FormData();
    const type = blob.type.split(';')[0]
    const file = new File([blob], `audio.${typeToExt[type]}`, { type });

    formData.append("model", "whisper-1");
    formData.append("file", file);

    const response = await fetch(
    `https://api.openai.com/v1/audio/transcriptions`,
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