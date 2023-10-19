export async function transcribe(blob: Blob, mediaType: 'webm' | 'mp4' = 'webm') {
    const formData = new FormData();
    const file = new File([blob], `audio.${mediaType}`, { type: `${mediaType}/audio` });

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