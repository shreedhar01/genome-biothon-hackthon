import React, { useState } from "react";
import Webcam from "react-webcam";
import { Button } from "./ui/button";

const VIDEO_WIDTH = 640;
const VIDEO_HEIGHT = 480;

export const CameraComponent = () => {
    const [capturedImage, setCapturedImage] = useState<string | null>(null);

    const videoConstraints = {
        width: VIDEO_WIDTH,
        height: VIDEO_HEIGHT,
        facingMode: "user",
    };
    const webcamRef = React.useRef<Webcam>(null);

    const capture = React.useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            setCapturedImage(imageSrc);
        }
    }, [webcamRef]);

    // Convert base64 to a File/Blob (for sending to API or uploading)
    const base64ToFile = (base64: string, filename: string): File => {
        const arr = base64.split(",");
        const mime = arr[0].match(/:(.*?);/)![1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) u8arr[n] = bstr.charCodeAt(n);
        return new File([u8arr], filename, { type: mime });
    };

    const sendToApi = async () => {
        if (!capturedImage) return;

        // Option 2: send as multipart/form-data (e.g. to a REST upload endpoint)
        // const file = base64ToFile(capturedImage, "capture.jpg");
        // const formData = new FormData();
        // formData.append("file", file);
        // await fetch("https://your-api.com/upload", {
        //     method: "POST",
        //     body: formData,
        // });
    };

    return (
        <>
            {capturedImage
                ?
                <div className="flex flex-col items-center gap-y-2">
                    <img src={capturedImage} alt="captured" width={VIDEO_WIDTH} height={VIDEO_HEIGHT} />
                    <div>
                        <Button onClick={sendToApi}>Send to API</Button>
                        <Button
                            onClick={() => setCapturedImage(null)}
                            className="bg-green-400"
                        >
                            Retake
                        </Button>
                    </div>

                </div>
                :
                <div className="flex flex-col items-center gap-y-2">
                    <div
                        style={{ width: VIDEO_WIDTH, height: VIDEO_HEIGHT }}
                        className="border"
                    >
                        <Webcam
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={videoConstraints}
                            width={VIDEO_WIDTH}
                            height={VIDEO_HEIGHT}
                            style={{ width: VIDEO_WIDTH, height: VIDEO_HEIGHT, objectFit: "cover" }}
                        />
                    </div>
                    <Button onClick={capture}>Capture photo</Button>
                </div>
            }
        </>
    );
};