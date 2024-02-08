"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import React from "react";

type DraftPokemonProps = {
  name: string;
  tier: string;
  spriteUrl: string;
  typeIconUrls: string[];
};

const DraftOption = (props: DraftPokemonProps) => {
  return (
    <div className="rounded-xl from-pink-500 to-red-500 p-1 shadow hover:cursor-pointer hover:bg-gradient-to-r">
      <div className="rounded-xl bg-card p-4 text-card-foreground">
        <div className="flex h-56 w-36 flex-col items-center justify-center gap-1 ">
          {/* NAME */}
          <h3 className="font-semibold leading-none tracking-tight">
            {props.name}
          </h3>
          {/* TYPE ICONS */}
          <div className="flex gap-2">
            {props.typeIconUrls.map((url) => (
              <Image
                width={32}
                height={14}
                src={url}
                alt={`${props.name} type`}
              />
            ))}
          </div>
          {/* TIER */}
          <h4 className="mb-6 text-sm text-muted-foreground">{props.tier}</h4>
          {/* SPRITE */}
          <div className="relative flex h-40 w-32 items-center justify-center">
            <Image
              className="object-contain"
              fill
              src={props.spriteUrl}
              alt={props.name}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DraftOption;
