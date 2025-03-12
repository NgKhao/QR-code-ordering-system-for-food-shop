import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";
import React from "react";

export default function Quantity({
  onChange,
  value,
}: {
  onChange: (value: number) => void;
  value: number;
}) {
  return (
    <div className="flex items-center rounded-full border border-orange-200 p-1 bg-white">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 rounded-full hover:bg-orange-100 text-orange-500"
        disabled={value == 0}
        onClick={() => onChange(value - 1)}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        className="h-6 p-1 w-8 text-center"
        value={value}
        onChange={(e) => {
          const value = e.target.value;
          const numberValue = Number(value);
          if (isNaN(numberValue)) return;
          onChange(numberValue);
        }}
      />
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 rounded-full hover:bg-orange-100 text-orange-500"
        onClick={() => onChange(value + 1)}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
