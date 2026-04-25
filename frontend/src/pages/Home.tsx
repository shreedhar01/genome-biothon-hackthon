import { Button } from "@/components/ui/button";
import { useState } from "react";

export function HomePage() {
  const [lan, setLan] = useState(true)

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full">
      <div className="flex items-center justify-between px-2 md:pl-0 py-2 w-full md:max-w-7xl">
        <p className="text-xl font-medium ">{lan ? "Khet Ko Sathi" : "खेतको साथी"}</p>
        <div>
          <Button
          onClick={()=> setLan(!lan)}
          className="text-xs"
          >
            {lan?"Change Language":"भाषा परिवर्तन गर्नुहोस्"}
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center w-full md:max-w-7xl h-full bg-green-400">
        <video id="webcam" width="640" height="480"></video>

        <h1 className="text-4xl font-bold">Welcome to the Home Page!</h1>
      </div>
    </div>
  );
}
