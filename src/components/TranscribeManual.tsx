"use client"

import { transcribe } from "@/utils/transcribe";
import { translate, translateGoogle } from "@/utils/translate";
import { useEffect, useRef, useState } from "react"
import styles from './Transcribe.module.css'

export default function Transcribe() {

    // manage user's audio recording state
    const [recording, setRecording] = useState<boolean>(false);
    const [audio, setAudio] = useState<Blob>()
    const [audioChunks, setAudioChunks] = useState<any>([]);
    const mediaRecorder = useRef<any>(null);

    const [transcription, setTranscription] = useState<string>('')
    const [translation, setTranslation] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    async function handleRecording(blob: any) {
        if (loading) return;
        setLoading(true);

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

    const handleToggle = () => {
        if (loading) return;
        if (recording) {
            // currently speaking, stop and process
            stopRecording();
        } else {
            // not recording, start speaking
            startRecording();
        }
    };

    // manage user's audio recording blobs
    useEffect(() => {
        if (!audio) return;

        // recordingBlob will be present at this point after 'stopRecording' has been called

        const doTranscription = async () => {
            await handleRecording(audio);
        };

        doTranscription();
    }, [audio]);

    async function startRecording() {
        setRecording(true);
        //create new Media recorder instance using the stream
        const options: MediaRecorderOptions = {
            mimeType: "audio/webm"
        }
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const media = new MediaRecorder(stream, options);
        //set the MediaRecorder instance to the mediaRecorder ref
        mediaRecorder.current = media;
        //invokes the start method to start the recording process
        mediaRecorder.current.start();
        let localAudioChunks: any[] = [];
        mediaRecorder.current.ondataavailable = (event: any) => {
           if (typeof event.data === "undefined") return;
           if (event.data.size === 0) return;
           localAudioChunks.push(event.data);
        };
        setAudioChunks(localAudioChunks);
    }

    function stopRecording() {
        setRecording(false);
        //stops the recording instance
        mediaRecorder.current.stop();
        mediaRecorder.current.onstop = () => {
          //creates a blob file from the audiochunks data
           const audioBlob = new Blob(audioChunks, { type: "webm/audio" });
          //creates a playable URL from the blob file.
           setAudio(audioBlob);
           setAudioChunks([]);
        };
    }

    return (
        <div className={styles.container}>
            <div className={styles.transcription}>
                {transcription}
            </div>
            <div className={styles.translation}>
                {translation}
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