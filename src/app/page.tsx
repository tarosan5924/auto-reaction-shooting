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
    <div className="container mx-auto my-4 px-4 max-w-xl">
      <input
        className="border border-solid border-gray-400 p-1 w-full"
        type="text"
        value={apiToken}
        placeholder={"APIトークンを入力"}
        onChange={(e) => {
          setApiToken(e.currentTarget.value);
        }}
      />
      <div className="flex flex-row m-1">
        <button
          className="border m-1 w-1/2"
          disabled={isStreaming}
          onClick={() => {
            setIsStreaming(true);
            const newChannel = new Misskey.Stream("https://misskey.systems", {
              token: apiToken,
            }).useChannel("localTimeline");
            setChannel(newChannel);
            newChannel.on("note", async (payload) => {
              if (
                payload.text?.includes("てェ…") ||
                payload.text?.includes("でェ…")
              ) {
                await new Misskey.api.APIClient({
                  origin: "https://misskey.systems",
                  credential: apiToken,
                }).request("notes/reactions/create", {
                  noteId: payload.id,
                  reaction: "🚀",
                });
              }
            });
          }}
        >
          開始
        </button>
        <button
          className="border m-1 w-1/2"
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
    </div>
  );
};

export default Home;
