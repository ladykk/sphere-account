"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DayPickerSingleProps,
  DayPickerMultipleProps,
  DayPickerRangeProps,
} from "react-day-picker";

export function DatePickerDemo(
  props: React.JSX.IntrinsicAttributes &
    (DayPickerSingleProps | DayPickerMultipleProps | DayPickerRangeProps)
) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !props.selected && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {props.selected && props.mode === "single" ? (
            format(props.selected, "PPP")
          ) : props.selected && props.mode === "range" ? (
            `${
              props.selected.from
                ? format(props.selected.from, "PPP")
                : "Pick a date"
            } - ${
              props.selected.to
                ? format(props.selected.to, "PPP")
                : "Pick a date"
            }`
          ) : props.selected && props.mode === "multiple" ? (
            `${props.selected.length} selected`
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar {...props} initialFocus />
      </PopoverContent>
    </Popover>
  );
}
