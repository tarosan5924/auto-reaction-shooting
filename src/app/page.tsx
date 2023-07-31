"use client";
import { useRouter } from "next/navigation";

const Home = (): JSX.Element => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center mx-auto my-4 px-4 max-w-xl">
      <h1 className="text-center text-3xl my-2">リアクションシューター</h1>
      <button
        className="border m-1 p-1 w-1/2 border-transparent bg-green-400 hover:bg-transparent hover:border-green-400"
        onClick={() => {
          router.push("/korok-syntax");
        }}
      >
        コログ構文
      </button>
      <button
        className="border m-1 p-1 w-1/2 border-transparent bg-red-400 hover:bg-transparent hover:border-red-400"
        onClick={() => {}}
      >
        ダジャレ審議
      </button>
    </div>
  );
};

export default Home;
