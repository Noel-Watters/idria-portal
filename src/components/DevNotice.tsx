import { BadgeInfo } from "lucide-react";

export default function DevtNotice() {
  return (
    <p className="text-primary text-sm flex items-start gap-2">
      <BadgeInfo className="w-4 h-4 mt-0.5 shrink-0" />

      Idria is currently in early development. The website and in-game
      systems are still in the works! Everything is highly subject to
      change. Enjoy following along in the development process with us.
    </p>
  );
}