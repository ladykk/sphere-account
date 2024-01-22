import React, { Fragment } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Check, ChevronDown, ChevronUp, X } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./command";
import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";
import { useMediaQuery } from "usehooks-ts";
import { Drawer, DrawerContent, DrawerTrigger } from "./drawer";

export interface ComboBoxProps<T, V extends string | number> {
  value: V | undefined;
  onChange: (value: V | undefined) => void;
  options: Array<T> | undefined;
  setLabel: (value: T) => string;
  setValue: (value: T) => V;
  loading?: boolean;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  setKeyword?: (value: T) => string;
  searchPlaceholder?: string;
  searchNoResultText?: string;
  customItemRender?: (option: T, checked: boolean) => JSX.Element;
  clearable?: boolean;
  className?: string;
  classNames?: {
    trigger?: string;
    drawerTrigger?: string;
  };
}

export function ComboBox<T, V extends string | number>(
  props: ComboBoxProps<T, V>
) {
  const options = props.options ?? [];
  const placeholder = props.placeholder ?? "Select an option...";
  const searchPlaceholder = props.searchPlaceholder ?? "Search an option...";
  const searchNoResultText = props.searchNoResultText ?? "No option found.";

  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedOption = options.find(
    (option) => props.setValue(option) === props.value
  );

  function Trigger() {
    return (
      <>
        {selectedOption
          ? props.customItemRender
            ? props.customItemRender(selectedOption, true)
            : props.setLabel(selectedOption)
          : placeholder}

        {props.loading ? (
          <Spinner />
        ) : open && !props.disabled && !props.readOnly ? (
          <ChevronUp className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        ) : (
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        )}
      </>
    );
  }

  function Content() {
    return (
      <Command>
        <CommandInput placeholder={searchPlaceholder} />
        <CommandEmpty>{searchNoResultText}</CommandEmpty>
        <CommandGroup
          className={cn(
            "overflow-auto",
            isDesktop ? "max-h-[25svh]" : "max-h-[50svh]"
          )}
        >
          {options.map((option) => (
            <CommandItem
              key={props.setValue(option).toString()}
              value={
                props.setKeyword
                  ? props.setKeyword(option)
                  : props.setLabel(option)
              }
              onSelect={() => {
                const newOption = options.find(
                  (o) => props.setValue(o) === props.setValue(option)
                );
                props.onChange(
                  newOption ? props.setValue(newOption) : undefined
                );
                setOpen(false);
              }}
            >
              <Fragment>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    props.value === props.setValue(option)
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {props.customItemRender
                  ? props.customItemRender(
                      option,
                      props.value === props.setValue(option)
                    )
                  : props.setLabel(option)}
              </Fragment>
            </CommandItem>
          ))}
        </CommandGroup>
        {props.clearable && selectedOption && (
          <CommandGroup className="border-t">
            <CommandItem
              className="hover:text-destructive"
              onSelect={() => {
                props.onChange(undefined);
                setOpen(false);
              }}
            >
              <X className="mr-2 h-4 w-4" />
              Clear
            </CommandItem>
          </CommandGroup>
        )}
      </Command>
    );
  }

  return (
    <div ref={containerRef} className={props.className}>
      {isDesktop ? (
        <Popover
          open={open && !props.disabled && !props.readOnly && !props.loading}
          onOpenChange={setOpen}
        >
          <PopoverTrigger asChild>
            <div className="flex">
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn(
                  "w-full justify-between font-normal",
                  props.classNames?.trigger
                )}
                disabled={props.disabled || props.loading}
                type="button"
              >
                <Trigger />
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent
            style={{
              width: containerRef.current?.offsetWidth,
            }}
            className="w-full p-0"
            container={containerRef.current}
          >
            <Content />
          </PopoverContent>
        </Popover>
      ) : (
        <Drawer
          open={open && !props.disabled && !props.readOnly && !props.loading}
          onOpenChange={setOpen}
        >
          <DrawerTrigger asChild>
            <div className="flex">
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn(
                  "justify-between font-normal w-full",
                  props.classNames?.drawerTrigger
                )}
                disabled={props.disabled || props.loading}
                type="button"
              >
                <Trigger />
              </Button>
            </div>
          </DrawerTrigger>
          <DrawerContent className="min-h-[50svh]">
            <Content />
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}
