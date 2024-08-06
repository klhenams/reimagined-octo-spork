// "use client";

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

// export function Selector({
//   options,
//   placeholder,
//   nameField,
//   valueField,
// }: {
//   options:
//     | { name: string; value: string; [key: string]: any }[]
//     | { name: string; iosCode: string; [key: string]: any }[];
//   placeholder?: string;
//   nameField: string;
//   valueField: string;
// }) {
//   const [open, setOpen] = React.useState(false);
//   const [value, setValue] = React.useState<{
//     name: string;
//     [key: string]: any;
//   }>();

//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <Button
//           variant="outline"
//           role="combobox"
//           aria-expanded={open}
//           className="w-[200px] justify-between"
//         >
//           {value ? value.name : placeholder ?? "Select"}
//           <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-[200px] p-0">
//         <Command>
//           <CommandInput placeholder="Search framework..." className="h-9" />
//           <CommandList>
//             <CommandEmpty>No framework found.</CommandEmpty>
//             <CommandGroup>
//               {options.map((option) => (
//                 <CommandItem
//                   key={option.name}
//                   //   value={option.name}
//                   onSelect={(currentValue) => {
//                     setValue(currentValue === value ? "" : currentValue
//                         currentValue.ios
//                     );
//                     setOpen(false);
//                   }}
//                 >
//                   {option.name}
//                   <CheckIcon
//                     className={cn(
//                       "ml-auto h-4 w-4",
//                       value === option.name ? "opacity-100" : "opacity-0"
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
