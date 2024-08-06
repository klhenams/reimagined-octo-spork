"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

const DateInput: React.FC<React.HTMLProps<HTMLInputElement>> = (props) => {
  const [date, setDate] = React.useState<Date | undefined>(
    props.defaultValue ? new Date(props.defaultValue as string) : new Date()
  );

  return (
    <div className={cn("flex flex-col space-y-2 w-full")}>
      {props.label && <Label htmlFor={props.id}>{props.label}</Label>}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal h-auto outline-none",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {/** input to hold value */}
      <input name={props.name} value={date?.toISOString()} className="hidden" readOnly />
    </div>
  );
};

export default DateInput;
