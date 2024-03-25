"use client";

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
    <div className="rounded-xl from-purple-500 to-blue-500 p-1 shadow hover:cursor-pointer hover:bg-gradient-to-tr peer-data-[state=checked]:bg-gradient-to-tr peer-data-[state=checked]:from-pink-500 peer-data-[state=checked]:to-red-500">
      <div className="rounded-xl bg-card p-4 text-card-foreground">
        <div className="flex h-64 w-44 flex-col items-center justify-center gap-1 ">
          {/* NAME */}
          <h3 className="select-none font-semibold leading-none tracking-tight">
            {props.name}
          </h3>
          {/* TYPE ICONS */}
          <div className="flex gap-2">
            {props.typeIconUrls.map((url, i) => (
              <Image
                key={i}
                className="pointer-events-none select-none"
                width={32}
                height={14}
                src={url}
                alt={`${props.name} type`}
              />
            ))}
          </div>
          {/* TIER */}
          <h4 className="mb-6 select-none text-sm text-muted-foreground">
            {props.tier}
          </h4>
          {/* SPRITE */}
          <div className="relative flex h-40 w-32 items-center justify-center">
            <Image
              className="pointer-events-none select-none object-contain"
              priority
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
