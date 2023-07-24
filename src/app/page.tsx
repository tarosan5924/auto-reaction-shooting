"use client";
import { useState } from "react";
import * as Misskey from "misskey-js";

const Home = (): JSX.Element => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [apiToken, setApiToken] = useState<string>("");
  const [channel, setChannel] = useState<null | Misskey.ChannelConnection<{
    params: null;
    events: {
      note: (payload: Misskey.entities.Note) => void;
    };
    receives: null;
  }>>(null);

  return (
    <div>
      <input
        type="text"
        value={apiToken}
        placeholder={"APIトークンを入力"}
        onChange={(e) => {
          setApiToken(e.currentTarget.value);
        }}
      />
      <button
        disabled={isStreaming}
        onClick={() => {
          setIsStreaming(true);
          const newChannel = new Misskey.Stream("https://misskey.systems", {
            token: apiToken,
          }).useChannel("localTimeline");
          setChannel(newChannel);
          newChannel.on("note", (payload) => {
            console.log(payload);
          });
        }}
      >
        開始
      </button>
      <button
        disabled={!isStreaming}
        onClick={() => {
          setIsStreaming(false);
          if (!channel) {
            return;
          }
          channel.dispose();
          setChannel(null);
        }}
      >
        終了
      </button>
    </div>
  );
};

export default Home;

const useChannelStream = () => {};
