"use client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect } from "react";

export default function SSSelect(
  props: {
    placeholder?: string;
    options?: { name: string; value: string }[];
    name?: string;
    onValueChange?: (value: string) => void;
    defaultValue?: string;
    disabled?: boolean
  }
) {

  return (
    <Select name={props.name} onValueChange={props.onValueChange} defaultValue={props.defaultValue?.toString()} disabled={props.disabled}>
      <SelectTrigger>
        <SelectValue placeholder={props.placeholder} />
      </SelectTrigger>
      <SelectContent>
        {props.options?.map((option, index) => (
          <SelectItem key={index} value={option.value} defaultChecked={option.value===props.defaultValue}>
            {option.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
