"use client";
import { useState } from "react";
import * as Misskey from "misskey-js";
import { dajareWake } from "../service/JudgeDajareService";

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
      <h1 className="text-center text-3xl my-2">
        ダジャレリアクションシューター
      </h1>
      <div className="my-2">
        使い方
        <ol className="pl-2 my-1">
          <li>1.APIトークンを入力</li>
          <li>2.開始ボタンを押す</li>
          <li>3.ダジャレノートが流れてくるのを待つ</li>
        </ol>
        以上！！
        <br />
        ※誤検知によるトラブルについて一切の責任は負いません。
      </div>
      <input
        className="border border-solid border-gray-400 p-1 w-full my-1"
        type="text"
        value={apiToken}
        placeholder={"APIトークンを入力"}
        onChange={(e) => {
          setApiToken(e.currentTarget.value);
        }}
      />
      <div className="flex flex-row m-1">
        <button
          className="border m-1 p-1 w-1/2 border-transparent bg-green-400 hover:bg-transparent hover:border-green-400 disabled:bg-gray-200 disabled:hover:border-transparent disabled:text-gray-400"
          disabled={isStreaming}
          onClick={() => {
            setIsStreaming(true);
            const newChannel = new Misskey.Stream("https://misskey.systems", {
              token: apiToken,
            }).useChannel("localTimeline");
            setChannel(newChannel);
            newChannel.on("note", async (payload) => {
              //長すぎる分は誤検知の可能性が高まるので判定しない
              if ((payload.text ?? "").length > 15) {
                return;
              }
              if (await dajareWake(payload.text ?? "")) {
                await new Misskey.api.APIClient({
                  origin: "https://misskey.systems",
                  credential: apiToken,
                }).request("notes/reactions/create", {
                  noteId: payload.id,
                  reaction: ":shingi:",
                });
              }
            });
          }}
        >
          開始
        </button>
        <button
          className="border m-1 p-1 w-1/2 border-transparent bg-red-400 hover:bg-transparent hover:border-red-400 disabled:bg-gray-200 disabled:hover:border-transparent disabled:text-gray-400"
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
