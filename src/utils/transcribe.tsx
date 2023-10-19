export async function transcribe(blob: Blob) {
    const formData = new FormData();
    const type = blob.type
    const ext = (type: string) => {
        switch (type) {
            case 'audio/webm': return 'webm';
            case 'audio/mp4': return 'mp4';
        }
    }
    const file = new File([blob], `audio.${ext}`, { type });

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