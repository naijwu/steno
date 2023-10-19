"use client"

import { useEffect, useState } from "react"
import { useAudioRecorder } from "react-audio-voice-recorder";
import styles from './Transcribe.module.css'

export default function Transcribe() {

    const [transcription, setTranscription] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

  const { startRecording, stopRecording, recordingBlob } = useAudioRecorder();

    async function handleTranscription(blob: any) {
        if (loading) return;
        setLoading(true);

        // audio file -> openAI whisper -> text
        const formData = new FormData();
        const file = new File([blob], "audio.webm", { type: "webm/audio" });

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

        if (!data.text) {
            setLoading(false);
            return;
        }

        setTranscription(data.text);
        setLoading(false);
    }

    // manage user's audio recording blobs
    useEffect(() => {
        if (!recordingBlob) return;

        // recordingBlob will be present at this point after 'stopRecording' has been called

        const doTranscription = async () => {
        await handleTranscription(recordingBlob);
        };

        doTranscription();
    }, [recordingBlob]);

    // manage user's audio recording state
    const [recording, setRecording] = useState<boolean>(false);

    const handleToggle = () => {
        if (loading) return;
        if (recording) {
        // currently speaking, stop and process
        stopRecording();
        setRecording(false);
        } else {
        // not recording, start speaking
        startRecording();
        setRecording(true);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.transcription}>
                {transcription}
            </div>
            <div className={styles.engage}>
                {loading ? (
                    <div className={styles.loading}>
                        loading...
                    </div>
                ) : (
                    <div className={styles.button} onClick={handleToggle}>{recording ? "recording..." : "record"}</div>
                )}
            </div>
        </div>
    )
}