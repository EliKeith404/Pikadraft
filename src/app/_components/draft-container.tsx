"use client";

import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { type RouterOutputs } from "~/trpc/shared";
import DraftOption from "./draft-option";

type DraftContainerProps = {
  pokeSelections: RouterOutputs["pokemon"]["getRandomSetByTier"];
  children?: React.ReactNode;
};

const DraftContainer = (props: DraftContainerProps) => {
  // const [currentParty, setCurrentParty] = useState<string[]>([]);
  const [selection, setSelection] = useState<string>("");

  return (
    <RadioGroup className="flex gap-2">
      {props.pokeSelections.map((poke) => (
        <div key={poke.name} onClick={() => setSelection(poke.name)}>
          <RadioGroupItem
            checked={selection === poke.name}
            value={poke.name}
            id={poke.name}
            className="peer sr-only"
          />
          <DraftOption
            name={poke.name}
            tier={poke.tier}
            spriteUrl={poke.spriteUrl}
            typeIconUrls={poke.typeIconUrls}
          />
        </div>
      ))}
    </RadioGroup>
  );
};

export default DraftContainer;
