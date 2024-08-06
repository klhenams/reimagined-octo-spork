// "use client";
// import { Country, State, City } from "country-state-city";

// import * as React from "react";
// import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";


// export function CountrySelect() {
//   const [open, setOpen] = React.useState(false);
//   const [value, setValue] = React.useState("");
//   const countries = Country.getAllCountries()
//   const states = State.getStatesOfCountry(value.code)

//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <Button
//           variant="outline"
//           role="combobox"
//           aria-expanded={open}
//           className="w-[200px] justify-between"
//         >
//           {value
//             ? countries.find((country) => country.name === value)?.name
//             : "Select Country"}
//           <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-[200px] p-0">
//         <Command>
//           <CommandInput placeholder="Search framework..." className="h-9" />
//           <CommandList>
//             <CommandEmpty>No framework found.</CommandEmpty>
//             <CommandGroup>
//               {Country.getAllCountries().map((country) => (
//                 <CommandItem
//                   key={country.name}
//                   value={country.name}
//                   onSelect={(currentValue) => {
//                     setValue(currentValue === value ? "" : currentValue);
//                     setOpen(false);
//                   }}
//                 >
//                   {country.name}
//                   <CheckIcon
//                     className={cn(
//                       "ml-auto h-4 w-4",
//                       value === country.name ? "opacity-100" : "opacity-0"
//                     )}
//                   />
//                 </CommandItem>
//               ))}
//             </CommandGroup>
//           </CommandList>
//         </Command>
//       </PopoverContent>
//     </Popover>
//   );
// }
