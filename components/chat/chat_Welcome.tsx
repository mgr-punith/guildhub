import { Hash } from "lucide-react";

interface ChatWelcomeProps {
  name: string;
  type: "channel" | "conversation";
}

export const ChatWelcome = ({ name, type }: ChatWelcomeProps) => {
  return (
    <div className="space-y-2 px-6 mb-4 bg-zinc-300 dark:bg-zinc-800 m-2 p-4 rounded-2xl">
      {type === "channel" && (
        <div className="w-[75px] h-[75px] rounded-full bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center">
          <Hash className="h-12 w-12 text-white" />
        </div>
      )}
      <p className="text-xl md:text-4xl font-semibold">
        {type === "channel" ? "Welcome to #" : ""}
        {name}
      </p>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {type === "channel"
          ? `This is the start of ${name} channel `
          : `This is the start of your conversation with ${name}.`}
      </p>
    </div>
  );
};
