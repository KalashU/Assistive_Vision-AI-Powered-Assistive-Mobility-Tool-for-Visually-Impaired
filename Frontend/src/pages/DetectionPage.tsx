import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, ArrowLeft, Video, VideoOff, Volume2, VolumeX, AlertTriangle, Loader2, Upload, Image as ImageIcon, Film } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useVoiceFeedback } from '../hooks/useVoiceFeedback';

interface Detection {
  class: string;
  confidence: number;
  bbox: number[];
}

export function DetectionPage() {
  const navigate = useNavigate();
  const { speak } = useVoiceFeedback();
  
  // Refs for media elements
  const videoRef = useRef<HTMLVideoElement>(null);      // Webcam
  const fileVideoRef = useRef<HTMLVideoElement>(null);  // Uploaded Video
  const fileImageRef = useRef<HTMLImageElement>(null);  // Uploaded Image
  const canvasRef = useRef<HTMLCanvasElement>(null);    // Shared processing canvas
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mode State
  const [mode, setMode] = useState<'camera' | 'upload'>('camera');
  const [fileType, setFileType] = useState<'image' | 'video' | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  // Logic State
  const [isStreaming, setIsStreaming] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [serverStatus, setServerStatus] = useState<'offline' | 'online' | 'connecting' | 'idle'>('idle');
  const [lastAlert, setLastAlert] = useState<string>("");
  const processingRef = useRef(false);

  // --- CAMERA LOGIC ---
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 640 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setIsStreaming(true);
          setServerStatus('connecting');
          speak("Camera started.");
        };
      }
    } catch (err) {
      console.error(err);
      speak("Error accessing camera.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    setServerStatus('idle');
  };

  // --- FILE UPLOAD LOGIC ---
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Cleanup previous URL
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    setDetections([]);
    setLastAlert("");

    const url = URL.createObjectURL(file);
    setFileUrl(url);

    if (file.type.startsWith('image/')) {
      setFileType('image');
      setIsStreaming(false); // Stop loop, we process once
      // Wait for image render then process
      setTimeout(() => processFrame(fileImageRef.current), 500); 
    } else if (file.type.startsWith('video/')) {
      setFileType('video');
      setIsStreaming(false); // Don't auto-start, user must click play
    }
  };

  const toggleVideoPlayback = () => {
    if (fileVideoRef.current) {
      if (isStreaming) {
        fileVideoRef.current.pause();
        setIsStreaming(false);
      } else {
        fileVideoRef.current.play();
        setIsStreaming(true);
      }
    }
  };

  // --- SHARED DETECTION CORE ---
  const processFrame = useCallback((sourceElement: HTMLVideoElement | HTMLImageElement | null) => {
    if (!sourceElement || !canvasRef.current || processingRef.current) return;
    
    // Check if dimensions are ready
    const width = (sourceElement as HTMLVideoElement).videoWidth || (sourceElement as HTMLImageElement).naturalWidth;
    const height = (sourceElement as HTMLVideoElement).videoHeight || (sourceElement as HTMLImageElement).naturalHeight;

    if (!width || !height) return;

    processingRef.current = true;
    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(sourceElement, 0, 0, width, height);
      
      canvas.toBlob(async (blob) => {
        if (!blob) { processingRef.current = false; return; }
        
        const formData = new FormData();
        formData.append("file", blob, "frame.jpg");

        try {
          const res = await fetch('http://localhost:5000/detect', { method: 'POST', body: formData });
          if (res.ok) {
            const data = await res.json();
            setDetections(data.detections);
            setServerStatus('online');
            
            if (audioEnabled && data.alert_message && data.alert_message !== lastAlert) {
              speak(data.alert_message);
              setLastAlert(data.alert_message);
              setTimeout(() => setLastAlert(""), 2500);
            }
          } else {
            setServerStatus('offline');
          }
        } catch (e) {
          setServerStatus('offline');
        } finally {
          processingRef.current = false;
        }
      }, 'image/jpeg', 0.8);
    } else {
      processingRef.current = false;
    }
  }, [audioEnabled, lastAlert, speak]);

  // --- LOOP ---
  useEffect(() => {
    let interval: any;
    if (isStreaming) {
      // Determine source based on mode
      const source = mode === 'camera' ? videoRef.current : fileVideoRef.current;
      interval = setInterval(() => processFrame(source), 100);
    }
    return () => clearInterval(interval);
  }, [isStreaming, mode, processFrame]);


  // --- RENDER BOXES ---
  const renderBoxes = (containerWidth: number, containerHeight: number, sourceWidth: number, sourceHeight: number) => {
    if (!sourceWidth || !sourceHeight) return null;
    const scaleX = containerWidth / sourceWidth;
    const scaleY = containerHeight / sourceHeight;

    return detections.map((d, i) => (
      <div key={i} style={{
        position: 'absolute',
        border: '3px solid #ef4444',
        left: d.bbox[0] * scaleX,
        top: d.bbox[1] * scaleY,
        width: (d.bbox[2] - d.bbox[0]) * scaleX,
        height: (d.bbox[3] - d.bbox[1]) * scaleY,
        pointerEvents: 'none'
      }}>
        <span className="absolute -top-6 left-0 bg-red-600 text-white text-xs px-2 py-1 rounded">
          {d.class} {Math.round(d.confidence * 100)}%
        </span>
      </div>
    ));
  };

  // Helper to get bounding box scaling based on current visible element
  const Overlay = () => {
    let el: HTMLElement | null = null;
    let nW = 0, nH = 0;

    if (mode === 'camera' && videoRef.current) {
      el = videoRef.current;
      nW = videoRef.current.videoWidth;
      nH = videoRef.current.videoHeight;
    } else if (mode === 'upload') {
      if (fileType === 'video' && fileVideoRef.current) {
        el = fileVideoRef.current;
        nW = fileVideoRef.current.videoWidth;
        nH = fileVideoRef.current.videoHeight;
      } else if (fileType === 'image' && fileImageRef.current) {
        el = fileImageRef.current;
        nW = fileImageRef.current.naturalWidth;
        nH = fileImageRef.current.naturalHeight;
      }
    }

    if (!el || !nW) return null;
    return <>{renderBoxes(el.clientWidth, el.clientHeight, nW, nH)}</>;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => navigate('/home')} className="p-3 bg-gray-800 rounded-full hover:bg-gray-700">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-full border border-gray-700">
           <div className={`w-2.5 h-2.5 rounded-full ${serverStatus === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
           <span className="text-xs font-medium text-gray-300">{serverStatus === 'online' ? 'AI ACTIVE' : 'STANDBY'}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-4">
        <button 
          onClick={() => { setMode('camera'); stopCamera(); setDetections([]); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${mode === 'camera' ? 'bg-blue-600' : 'bg-gray-800'}`}>
          <Camera size={20} /> Live Camera
        </button>
        <button 
          onClick={() => { setMode('upload'); stopCamera(); setDetections([]); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${mode === 'upload' ? 'bg-blue-600' : 'bg-gray-800'}`}>
          <Upload size={20} /> Upload File
        </button>
      </div>

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-gray-700 shadow-2xl">
           
           {/* CAMERA MODE */}
           {mode === 'camera' && (
             <>
               {!isStreaming && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                     <Camera size={64} className="mb-4 opacity-50" />
                     <p>Camera Offline</p>
                  </div>
               )}
               <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-contain" />
             </>
           )}

           {/* UPLOAD MODE */}
           {mode === 'upload' && (
             <>
                {!fileUrl && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-900 transition cursor-pointer"
                       onClick={() => fileInputRef.current?.click()}>
                     <Upload size={64} className="mb-4" />
                     <p className="font-semibold">Click to Upload Image or Video</p>
                     <p className="text-sm opacity-60 mt-2">Supports JPG, PNG, MP4</p>
                  </div>
                )}
                {fileType === 'image' && fileUrl && (
                  <img ref={fileImageRef} src={fileUrl} className="w-full h-full object-contain" alt="Uploaded" />
                )}
                {fileType === 'video' && fileUrl && (
                  <video ref={fileVideoRef} src={fileUrl} playsInline loop muted className="w-full h-full object-contain" />
                )}
             </>
           )}

           <Overlay />
           <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>

      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        className="hidden" 
        accept="image/*,video/*" 
      />

      {/* Alert Panel */}
      <div className="mt-4 mb-4">
         <div className={`p-4 rounded-xl border transition-all ${lastAlert ? 'bg-red-900/30 border-red-500' : 'bg-gray-800 border-gray-700'}`}>
             <div className="flex items-center gap-3">
                 <AlertTriangle size={20} className={lastAlert ? 'text-red-500' : 'text-yellow-500'} />
                 <span className="font-bold text-gray-200">Safety Alert: {lastAlert || "None"}</span>
             </div>
         </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-6 pb-4">
        {mode === 'camera' ? (
          <button onClick={isStreaming ? stopCamera : startCamera}
            className={`flex-1 max-w-xs py-4 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-3 ${
              isStreaming ? 'bg-red-600' : 'bg-blue-600'
            }`}>
            {isStreaming ? <><VideoOff /> Stop</> : <><Video /> Start Live</>}
          </button>
        ) : (
          <div className="flex gap-4 w-full justify-center">
            <button onClick={() => fileInputRef.current?.click()} className="px-6 py-4 bg-gray-700 rounded-2xl font-bold">
              Change File
            </button>
            {fileType === 'video' && (
              <button onClick={toggleVideoPlayback} className={`px-6 py-4 rounded-2xl font-bold w-40 ${isStreaming ? 'bg-red-600' : 'bg-green-600'}`}>
                 {isStreaming ? "Pause" : "Play & Detect"}
              </button>
            )}
            {fileType === 'image' && (
              <button onClick={() => processFrame(fileImageRef.current)} className="px-6 py-4 bg-blue-600 rounded-2xl font-bold">
                 Re-scan
              </button>
            )}
          </div>
        )}
        
        <button onClick={() => setAudioEnabled(!audioEnabled)} className="px-6 rounded-2xl bg-gray-800">
          {audioEnabled ? <Volume2 /> : <VolumeX />}
        </button>
      </div>
    </div>
  );
}