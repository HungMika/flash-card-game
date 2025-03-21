"use client";

import { Button } from "./ui/button";
import React from "react";

interface AgeGroupSelectorProps {
  selectedAge: string | null;
  onSelect: (ageGroup: string) => void;
}

const AGE_GROUPS = ["1-2", "3-5", "6-8", "9-12"];

export const AgeGroupSelector = ({
  selectedAge,
  onSelect,
}: AgeGroupSelectorProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {AGE_GROUPS.map((age) => (
        <Button
          key={age}
          variant={age === selectedAge ? "default" : "outline"}
          onClick={() => onSelect(age)}
        >
          lớp {age}
        </Button>
      ))}
    </div>
  );
};
