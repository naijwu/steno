"use client"

import { transcribe } from "@/utils/transcribe";
import { translate, translateGoogle } from "@/utils/translate";
import { useEffect, useState } from "react"
import { useAudioRecorder } from "react-audio-voice-recorder";
import styles from './Transcribe.module.css'

export default function Transcribe() {

    const [transcription, setTranscription] = useState<string>('')
    const [translation, setTranslation] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

  const { startRecording, stopRecording, recordingBlob } = useAudioRecorder();

  const [debug, setDebug] = useState<string>('')

    async function handleRecording(blob: any) {
        if (loading) return;
        setLoading(true);

        setDebug(blob.size + ' ' + blob.type)

        const transcript = await transcribe(blob);
        // const translation = await translate(blob);
        const translation = await translateGoogle(transcript);

        if (!transcript && !translation) {
            setLoading(false);
            return;
        }

        setTranscription(transcript);
        setTranslation(translation);

        setLoading(false);
    }

    // manage user's audio recording blobs
    useEffect(() => {
        if (!recordingBlob) return;

        // recordingBlob will be present at this point after 'stopRecording' has been called

        const doTranscription = async () => {
            await handleRecording(recordingBlob);
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
            <div className={styles.translation}>
                {translation}
            </div>
            {debug}
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