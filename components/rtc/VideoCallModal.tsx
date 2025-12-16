"use client";

import { useEffect, useState, useRef } from "react";
import { Room, RoomEvent, RemoteParticipant, LocalParticipant, Track } from "livekit-client";
import { X, PhoneOff } from "lucide-react";

interface VideoCallModalProps {
  open: boolean;
  onClose: () => void;
  livekitUrl: string;
  token: string;
  callType: "audio" | "video";
  roomName: string;
  onEndCall: () => void;
}

export default function VideoCallModal({
  open,
  onClose,
  livekitUrl,
  token,
  callType,
  roomName,
  onEndCall,
}: VideoCallModalProps) {
  const [room, setRoom] = useState<Room | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localVideoTrack, setLocalVideoTrack] = useState<MediaStreamTrack | null>(null);
  const [remoteVideoTrack, setRemoteVideoTrack] = useState<any>(null); // LiveKit Track type
  const [localAudioEnabled, setLocalAudioEnabled] = useState(true);
  const [localVideoEnabled, setLocalVideoEnabled] = useState(callType === "video");

  useEffect(() => {
    if (!open) {
      // Modal kapalıysa room'u temizle
      if (room) {
        room.disconnect();
        setRoom(null);
        setIsConnected(false);
      }
      return;
    }

    // Room oluştur ve bağlan
    const connectToRoom = async () => {
      try {
        const { Room: LiveKitRoom } = await import("livekit-client");
        const newRoom = new LiveKitRoom();
        
        newRoom.on(RoomEvent.Connected, () => {
          console.log("[VideoCallModal] Connected to room");
          setIsConnected(true);
          setError(null);
        });

        newRoom.on(RoomEvent.Disconnected, () => {
          console.log("[VideoCallModal] Disconnected from room");
          setIsConnected(false);
          setRoom(null);
        });

        newRoom.on(RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => {
          console.log("[VideoCallModal] Participant connected:", participant.identity);
        });

        newRoom.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
          if (track.kind === "video" && participant instanceof RemoteParticipant) {
            // Track'ten MediaStreamTrack al (mediaStreamTrack property)
            const mediaStreamTrack = (track as any).mediaStreamTrack;
            if (mediaStreamTrack) {
              setRemoteVideoTrack(mediaStreamTrack);
            }
          }
        });

        await newRoom.connect(livekitUrl, token);
        setRoom(newRoom);

        // Local media tracks'leri al
        if (callType === "video") {
          const localVideo = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          const videoTrack = localVideo.getVideoTracks()[0];
          const audioTrack = localVideo.getAudioTracks()[0];
          
          if (videoTrack) {
            await newRoom.localParticipant.publishTrack(videoTrack, {
              source: Track.Source.Camera,
            });
            setLocalVideoTrack(videoTrack);
          }
          if (audioTrack) {
            await newRoom.localParticipant.publishTrack(audioTrack, {
              source: Track.Source.Microphone,
            });
          }
        } else {
          // Audio only
          const localAudio = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          const audioTrack = localAudio.getAudioTracks()[0];
          if (audioTrack) {
            await newRoom.localParticipant.publishTrack(audioTrack, {
              source: Track.Source.Microphone,
            });
          }
        }
      } catch (err: any) {
        console.error("[VideoCallModal] Connection error:", err);
        
        // Kamera/mikrofon hatalarını daha açıklayıcı göster
        if (err?.name === 'NotReadableError' || err?.message?.includes('video source')) {
          setError('Kamera başka bir uygulama tarafından kullanılıyor. Lütfen diğer uygulamaları kapatın.');
        } else if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
          setError('Kamera/mikrofon izni verilmedi. Lütfen tarayıcı ayarlarından izin verin.');
        } else if (err?.name === 'NotFoundError' || err?.name === 'DevicesNotFoundError') {
          setError('Kamera veya mikrofon bulunamadı. Lütfen cihazınızı kontrol edin.');
        } else {
          setError(err instanceof Error ? err.message : "Bağlantı hatası");
        }
      }
    };

    connectToRoom();

    return () => {
      if (room) {
        room.disconnect();
      }
    };
  }, [open, livekitUrl, token, callType]);

  // Video element refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoRef.current && localVideoTrack) {
      localVideoRef.current.srcObject = new MediaStream([localVideoTrack]);
    }
  }, [localVideoTrack]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteVideoTrack) {
      // remoteVideoTrack zaten MediaStreamTrack ise direkt kullan
      if (remoteVideoTrack instanceof MediaStreamTrack) {
        remoteVideoRef.current.srcObject = new MediaStream([remoteVideoTrack]);
      } else {
        // Eğer LiveKit Track objesi ise, mediaStreamTrack property'sini kullan
        const mediaTrack = (remoteVideoTrack as any).mediaStreamTrack || remoteVideoTrack;
        if (mediaTrack instanceof MediaStreamTrack) {
          remoteVideoRef.current.srcObject = new MediaStream([mediaTrack]);
        }
      }
    }
  }, [remoteVideoTrack]);

  const handleEndCall = async () => {
    if (room) {
      await room.disconnect();
    }
    onEndCall();
    onClose();
  };

  const toggleAudio = async () => {
    if (room) {
      // LiveKit SDK'da trackPublications kullan
      const audioPublications = Array.from(room.localParticipant.audioTrackPublications.values());
      for (const publication of audioPublications) {
        if (publication.track) {
          if (localAudioEnabled) {
            publication.track.stop();
            await room.localParticipant.unpublishTrack(publication.track);
          } else {
            const newAudio = await navigator.mediaDevices.getUserMedia({ audio: true });
            const newTrack = newAudio.getAudioTracks()[0];
            await room.localParticipant.publishTrack(newTrack, { source: Track.Source.Microphone });
          }
        }
      }
      setLocalAudioEnabled(!localAudioEnabled);
    }
  };

  const toggleVideo = async () => {
    if (room && callType === "video") {
      // LiveKit SDK'da trackPublications kullan
      const videoPublications = Array.from(room.localParticipant.videoTrackPublications.values());
      for (const publication of videoPublications) {
        if (publication.track) {
          if (localVideoEnabled) {
            publication.track.stop();
            await room.localParticipant.unpublishTrack(publication.track);
          } else {
            const newVideo = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            const newTrack = newVideo.getVideoTracks()[0];
            await room.localParticipant.publishTrack(newTrack, { source: Track.Source.Camera });
            setLocalVideoTrack(newTrack);
          }
        }
      }
      setLocalVideoEnabled(!localVideoEnabled);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="relative w-full h-full max-w-6xl max-h-[90vh] bg-slate-900 rounded-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-slate-800">
          <div className="text-white">
            <h3 className="font-semibold">
              {callType === "video" ? "Video Arama" : "Sesli Arama"}
            </h3>
            <p className="text-sm text-slate-400">
              {isConnected ? "Bağlandı" : "Bağlanıyor..."}
            </p>
          </div>
          <button
            onClick={handleEndCall}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            aria-label="Kapat"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-500/20 text-red-200 text-sm">
            {error}
          </div>
        )}

        {/* Video Area */}
        <div className="flex-1 relative bg-slate-950">
          {callType === "video" ? (
            <>
              {/* Remote Video (Full Screen) */}
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Local Video (Picture in Picture) */}
              {localVideoTrack && (
                <div className="absolute bottom-4 right-4 w-48 h-36 rounded-lg overflow-hidden border-2 border-white shadow-lg">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </>
          ) : (
            /* Audio Only - Avatar/Name Display */
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-white">
                <div className="w-32 h-32 rounded-full bg-blue-600 flex items-center justify-center text-4xl font-bold mb-4 mx-auto">
                  {roomName.charAt(0).toUpperCase()}
                </div>
                <p className="text-xl font-semibold">{roomName}</p>
                <p className="text-slate-400 mt-2">Sesli Arama</p>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-4 bg-slate-800 flex items-center justify-center gap-4">
          {callType === "video" && (
            <button
              onClick={toggleVideo}
              className={`p-3 rounded-full transition-colors ${
                localVideoEnabled
                  ? "bg-slate-700 hover:bg-slate-600 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
              aria-label={localVideoEnabled ? "Kamerayı Kapat" : "Kamerayı Aç"}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
          )}

          <button
            onClick={toggleAudio}
            className={`p-3 rounded-full transition-colors ${
              localAudioEnabled
                ? "bg-slate-700 hover:bg-slate-600 text-white"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
            aria-label={localAudioEnabled ? "Mikrofonu Kapat" : "Mikrofonu Aç"}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </button>

          <button
            onClick={handleEndCall}
            className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors"
            aria-label="Aramayı Bitir"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}





