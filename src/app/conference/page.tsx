"use client";
import {
  LiveKitRoom,
  VideoConference,
  formatChatMessageLinks,
  useToken,
  LocalUserChoices,
  PreJoin,
} from "@livekit/components-react";
import {
  Room,
  RoomConnectOptions,
  RoomOptions,
  VideoPresets,
} from "livekit-client";
import "@livekit/components-styles";
import "@livekit/components-styles/prefabs";

import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

const Page = () => {
  const router = useRouter();
  const query = useSearchParams();
  const roomId = query.get("room");
  const username = query.get("user") || "";

  const [preJoinChoices, setPreJoinChoices] = React.useState<
    LocalUserChoices | undefined
  >(undefined);

  const preJoinDefaults = React.useMemo(() => {
    return {
      username,
      videoEnabled: false,
      audioEnabled: true,
    };
  }, []);

  const handlePreJoinSubmit = React.useCallback((values: LocalUserChoices) => {
    setPreJoinChoices(values);
  }, []);

  const onPreJoinError = React.useCallback((e: any) => {
    console.error(e);
  }, []);

  const onLeave = React.useCallback(() => router.push("/"), []);

  return (
    <main data-lk-theme="default" className="h-[calc(100vh-64px)]">
      {roomId && !Array.isArray(roomId) && preJoinChoices ? (
        <ActiveRoom
          roomId={roomId}
          userChoices={preJoinChoices}
          onLeave={onLeave}
        />
      ) : (
        <div style={{ display: "grid", placeItems: "center", height: "100%" }}>
          <PreJoin
            onError={onPreJoinError}
            defaults={preJoinDefaults}
            onSubmit={handlePreJoinSubmit}
          />
        </div>
      )}
    </main>
  );
};

export default Page;

type ActiveRoomProps = {
  userChoices: LocalUserChoices;
  roomId: string;
  onLeave?: () => void;
};
const ActiveRoom = ({ roomId, userChoices, onLeave }: ActiveRoomProps) => {
  const tokenOptions = React.useMemo(() => {
    return {
      userInfo: {
        identity: userChoices.username, // TO DO: pass userId as identity
        name: userChoices.username,
      },
    };
  }, [userChoices.username]);
  const token = useToken("/api/get-participant-token", roomId, tokenOptions);

  const liveKitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  const roomOptions = React.useMemo((): RoomOptions => {
    return {
      videoCaptureDefaults: {
        deviceId: userChoices.videoDeviceId ?? undefined,
        resolution: VideoPresets.h720,
      },
      publishDefaults: {
        dtx: false,
        videoSimulcastLayers: [VideoPresets.h1080, VideoPresets.h720],
      },
      audioCaptureDefaults: {
        deviceId: userChoices.audioDeviceId ?? undefined,
      },
      adaptiveStream: { pixelDensity: "screen" },
      dynacast: true,
      e2ee: undefined,
    };
  }, [userChoices]);

  const room = React.useMemo(() => new Room(roomOptions), []);

  const connectOptions = React.useMemo((): RoomConnectOptions => {
    return {
      autoSubscribe: true,
    };
  }, []);

  console.log(token);

  if (!token) {
    return null;
  }
  return (
    <>
      <LiveKitRoom
        room={room}
        token={token}
        serverUrl={liveKitUrl}
        connectOptions={connectOptions}
        video={userChoices.videoEnabled}
        audio={userChoices.audioEnabled}
        data-lk-theme="default"
        onDisconnected={onLeave}
      >
        <VideoConference chatMessageFormatter={formatChatMessageLinks} />
      </LiveKitRoom>
    </>
  );
};
