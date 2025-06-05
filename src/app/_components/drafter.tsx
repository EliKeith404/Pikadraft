"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import Image from "next/image"
import { api } from "~/trpc/react"
import { useRouter } from "next/navigation"

import { Button } from "~/app/_components/ui/button"
import { Card, CardContent } from "~/app/_components/ui/card"
import { Checkbox } from "~/app/_components/ui/checkbox"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "~/app/_components/ui/command"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/app/_components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "~/app/_components/ui/popover"
import { Slider } from "~/app/_components/ui/slider"
import { cn } from "~/lib/utils"
import { useForm } from "react-hook-form"

const tiers = [
  { label: "Uber", value: "UBER" },
  { label: "OU (Overused)", value: "OU" },
  { label: "UU (Underused)", value: "UU" },
  { label: "RU (Rarely Used)", value: "RU" },
  { label: "NU (Never Used)", value: "NU" },
  { label: "PU (Partially Used)", value: "PU" },
  { label: "LC (Little Cup)", value: "LC" },
]

const generations = [
  { label: "Generation 1 (Red/Blue/Yellow)", value: "1" },
  { label: "Generation 2 (Gold/Silver/Crystal)", value: "2" },
  { label: "Generation 3 (Ruby/Sapphire/Emerald)", value: "3" },
  { label: "Generation 4 (Diamond/Pearl/Platinum)", value: "4" },
  { label: "Generation 5 (Black/White)", value: "5" },
  { label: "Generation 6 (X/Y)", value: "6" },
  { label: "Generation 7 (Sun/Moon)", value: "7" },
  { label: "Generation 8 (Sword/Shield)", value: "8" },
  { label: "Generation 9 (Scarlet/Violet)", value: "9" },
]

type FormValues = {
  tiers: string[]
  includeNFE: boolean
  includeRegional: boolean
  optionsPerRound: number
  rounds: number
  generation: string
}

export function PokemonDrafter() {
  const [draftStarted, setDraftStarted] = useState(false)
  const [currentRound, setCurrentRound] = useState(1)
  const [selectedPokemon, setSelectedPokemon] = useState<any[]>([])
  const router = useRouter()

  const form = useForm<FormValues>({
    defaultValues: {
      tiers: ["OU"],
      includeNFE: false,
      includeRegional: true,
      optionsPerRound: 3,
      rounds: 6,
      generation: "9",
    },
  })

  const { data: draftOptions, refetch: refetchDraftOptions } = api.pokemon.getRandomSetByTier.useQuery(
    {
      generation: Number(form.watch("generation")) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9,
      format: "tier",
      tier: form.watch("tiers") as Array<"OU" | "UU" | "RU" | "NU" | "PU" | "ZU" | "AG" | "Uber">,
      choose: form.watch("optionsPerRound"),
      currentParty: selectedPokemon.map(p => p.name),
      filters: {
        noRegionalFormes: !form.watch("includeRegional"),
        noNFE: !form.watch("includeNFE"),
        noMegaFormes: true,
        noItemFormes: true,
        noBattleFormes: true,
        noEventFormes: true,
      },
    },
    {
      enabled: draftStarted && form.watch("tiers").length > 0,
      staleTime: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    }
  )

  const startDraft = (values: FormValues) => {
    setCurrentRound(1)
    setSelectedPokemon([])
    setDraftStarted(true)
    void refetchDraftOptions()
  }

  const selectPokemon = (pokemon: any) => {
    const newSelected = [...selectedPokemon, pokemon]
    setSelectedPokemon(newSelected)

    if (currentRound < form.getValues().rounds) {
      setCurrentRound(currentRound + 1)
      void refetchDraftOptions()
    } else {
      setDraftStarted(false)
    }
  }

  const resetDraft = () => {
    setDraftStarted(false)
    setCurrentRound(1)
    setSelectedPokemon([])
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-red-600 mb-2">Pokémon Drafter</h1>
        <p className="text-gray-600">Build your competitive team by drafting Pokémon</p>
      </div>

      {!draftStarted ? (
        <Card className="border-2 border-red-200">
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(startDraft)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="tiers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Competitive Tiers</FormLabel>
                      <FormDescription>Select which competitive tiers to include in your draft</FormDescription>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                        {tiers.map((tier) => (
                          <FormItem key={tier.value} className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value.includes(tier.value)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...field.value, tier.value])
                                  } else {
                                    field.onChange(field.value.filter((value) => value !== tier.value))
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">{tier.label}</FormLabel>
                          </FormItem>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="includeNFE"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1">
                          <FormLabel className="font-normal cursor-pointer">
                            Include Not Fully Evolved Pokémon
                          </FormLabel>
                          <FormDescription>Include Pokémon that can still evolve</FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="includeRegional"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1">
                          <FormLabel className="font-normal cursor-pointer">Include Regional Variants</FormLabel>
                          <FormDescription>Include Alolan, Galarian, and other regional forms</FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="optionsPerRound"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Options Per Round: {field.value}</FormLabel>
                        <FormDescription>How many Pokémon to choose from each round</FormDescription>
                        <FormControl>
                          <Slider
                            value={[field.value]}
                            min={2}
                            max={6}
                            step={1}
                            onValueChange={(value) => field.onChange(value[0])}
                            className="mt-2"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rounds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Draft Rounds: {field.value}</FormLabel>
                        <FormDescription>How many Pokémon you'll draft for your team</FormDescription>
                        <FormControl>
                          <Slider
                            value={[field.value]}
                            min={1}
                            max={12}
                            step={1}
                            onValueChange={(value) => field.onChange(value[0])}
                            className="mt-2"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="generation"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Pokémon Generation</FormLabel>
                      <FormDescription>Include Pokémon up to this generation</FormDescription>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant="outline" role="combobox" className="justify-between">
                              {field.value
                                ? generations.find((gen) => gen.value === field.value)?.label
                                : "Select generation"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-full">
                          <Command>
                            <CommandInput placeholder="Search generation..." />
                            <CommandList>
                              <CommandEmpty>No generation found.</CommandEmpty>
                              <CommandGroup>
                                {generations.map((gen) => (
                                  <CommandItem
                                    key={gen.value}
                                    value={gen.value}
                                    onSelect={() => {
                                      form.setValue("generation", gen.value)
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === gen.value ? "opacity-100" : "opacity-0",
                                      )}
                                    />
                                    {gen.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
                  Start Draft
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">
              {currentRound <= form.getValues().rounds
                ? `Round ${currentRound} of ${form.getValues().rounds}`
                : "Draft Complete!"}
            </h2>
            <Button variant="outline" onClick={resetDraft}>
              Reset Draft
            </Button>
          </div>

          {Array.isArray(draftOptions) && draftOptions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {draftOptions.map((pokemon) => (
                <Card
                  key={pokemon.id}
                  className="overflow-hidden hover:border-red-400 transition-colors cursor-pointer"
                  onClick={() => selectPokemon(pokemon)}
                >
                  <div className="bg-gray-100 p-4 flex justify-center">
                    <Image
                      src={pokemon.spriteUrl || "/placeholder.svg?height=96&width=96"}
                      alt={pokemon.name}
                      width={96}
                      height={96}
                      className="h-24 w-24 object-contain"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold">{pokemon.name}</h3>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Tier: {pokemon.tier}</span>
                      <span>Gen {form.watch("generation")}</span>
                    </div>
                    <div className="flex gap-1 mt-2">
                      {pokemon.typeIconUrls.map((typeUrl: string) => (
                        <Image
                          key={typeUrl}
                          src={typeUrl}
                          alt="Type"
                          width={24}
                          height={24}
                          className="h-6 w-6"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 border rounded-lg">
              <h2 className="text-2xl font-bold text-green-600 mb-4">Draft Complete!</h2>
              <p className="mb-6">You've successfully drafted your Pokémon team.</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {selectedPokemon.map((pokemon, index) => (
                  <div key={pokemon.id} className="text-center">
                    <div className="bg-gray-100 rounded-full p-2 mx-auto w-16 h-16 flex items-center justify-center mb-2">
                      <Image
                        src={pokemon.spriteUrl || "/placeholder.svg?height=48&width=48"}
                        alt={pokemon.name}
                        width={48}
                        height={48}
                        className="h-12 w-12 object-contain"
                      />
                    </div>
                    <p className="text-sm font-medium truncate">{pokemon.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedPokemon.length > 0 && Array.isArray(draftOptions) && draftOptions.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="font-bold mb-2">Your Team So Far:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedPokemon.map((pokemon) => (
                  <div key={pokemon.id} className="flex items-center gap-1 bg-gray-100 rounded-full pl-1 pr-3 py-1">
                    <Image
                      src={pokemon.spriteUrl || "/placeholder.svg?height=24&width=24"}
                      alt={pokemon.name}
                      width={24}
                      height={24}
                      className="h-6 w-6 object-contain"
                    />
                    <span className="text-sm">{pokemon.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
