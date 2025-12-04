import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera as CameraIcon, RotateCcw } from 'lucide-react';

interface CameraProps {
  onCapture: (imageData: string) => void;
  onError: (error: string) => void;
}

export const Camera: React.FC<CameraProps> = ({ onCapture, onError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      onError("카메라를 켤 수 없어요. 브라우저 설정에서 카메라 권한을 허용해주세요!");
    }
  }, [onError]);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Horizontal flip for mirror effect
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(imageData);
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      <div className="relative w-full aspect-[4/3] bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover transform -scale-x-100"
        />
        <div className="absolute top-4 left-4 bg-black/50 text-white px-4 py-1 rounded-full text-sm backdrop-blur-sm">
          📸 얼굴을 비춰주세요
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          onClick={handleCapture}
          className="group relative flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg border-4 border-primary hover:scale-110 transition-transform duration-300"
          aria-label="사진 찍기"
        >
          <div className="w-16 h-16 bg-primary rounded-full group-hover:bg-yellow-300 transition-colors flex items-center justify-center">
            <CameraIcon className="w-8 h-8 text-white" />
          </div>
        </button>
      </div>
    </div>
  );
};