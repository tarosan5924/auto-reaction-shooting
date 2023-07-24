"use client";
import { useState } from "react";

const Home = (): JSX.Element => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [apiToken, setApiToken] = useState<string>("");

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
        }}
      >
        開始
      </button>
      <button
        disabled={!isStreaming}
        onClick={() => {
          setIsStreaming(false);
        }}
      >
        終了
      </button>
    </div>
  );
};

export default Home;
