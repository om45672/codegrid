"use client"
import Image from "next/image";
import {Button} from "@/components/ui/button"
import { toast } from "sonner";

export default function Home() {
  const handleclick = () => {
    toast.success("Button clicked succesfully");
  }
  return (
    <div>
      <Button onClick={()=>handleclick()}>
        Click me
      </Button>
    </div>
  );
}
