import React, { Fragment } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Check, ChevronDown, ChevronUp, Plus, X } from "lucide-react";
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
import Image from "next/image";
import { useCommandState } from "cmdk";

export interface ComboBoxProps<T, V extends string | number> {
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
  subfixIcon?: any;
  subfix?: string;
}

export interface SingleComboBoxProps<T, V extends string | number>
  extends ComboBoxProps<T, V> {
  multiple: false;
  value: V | undefined;
  onChange: (value: V | undefined) => void;
  creatable?: boolean;
}

export interface MultiComboBoxProps<T, V extends string | number>
  extends ComboBoxProps<T, V> {
  multiple: true;
  value: Array<V>;
  setMultiLabel?: (values: Array<T>) => string;
  onChange: (value: Array<V>) => void;
}

function CommandOptions<T, V extends string | number>(
  props: (SingleComboBoxProps<T, V> | MultiComboBoxProps<T, V>) & {
    selectedOptions: Array<T>;
    setOpen: (open: boolean) => void;
  }
) {
  const search = useCommandState((state) => state.search);
  const filtered = useCommandState((state) => state.filtered);

  return (
    <>
      {props.clearable && props.selectedOptions && (
        <CommandGroup className="border-t">
          {props.clearable && props.selectedOptions && (
            <CommandItem
              className="hover:text-destructive"
              onSelect={() => {
                if (props.multiple) {
                  props.onChange([]);
                } else {
                  props.onChange(undefined);
                }
                props.setOpen(false);
              }}
            >
              <X className="mr-2 h-4 w-4" />
              Clear
            </CommandItem>
          )}
        </CommandGroup>
      )}
      {!props.multiple &&
        props.creatable &&
        search.length > 0 &&
        filtered.count === 0 && (
          <div
            className={cn(
              "border-t overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground"
            )}
          >
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="justify-start relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full font-normal"
              onClick={() => {
                props.onChange(search as unknown as V);
                props.setOpen(false);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create "{search}"
            </Button>
          </div>
        )}
    </>
  );
}

export function ComboBox<T, V extends string | number>(
  props: SingleComboBoxProps<T, V> | MultiComboBoxProps<T, V>
) {
  const options = props.options ?? [];
  const placeholder = props.placeholder ?? "Select an option...";
  const searchPlaceholder = props.searchPlaceholder ?? "Search an option...";
  const searchNoResultText = props.searchNoResultText ?? "No option found.";

  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedOptions = options.filter((option) =>
    props.multiple
      ? props.value.includes(props.setValue(option))
      : props.setValue(option) === props.value
  );

  function Trigger() {
    return (
      <>
        {selectedOptions.length > 0
          ? selectedOptions.length === 1
            ? props.customItemRender
              ? props.customItemRender(selectedOptions[0], true)
              : props.setLabel(selectedOptions[0])
            : props.multiple && props.setMultiLabel
            ? props.setMultiLabel(selectedOptions)
            : `${selectedOptions.length} selected`
          : !props.multiple && props.creatable
          ? props.value || placeholder
          : placeholder}

        {props.loading ? (
          <Spinner />
        ) : props.subfixIcon ? (
          <Image
            src={props.subfixIcon}
            alt={props.subfix ?? ""}
            className="w-4 h-4 object-contain ml-2 shrink-0"
          />
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
          {options.length === 0 && (
            <p className="text-center py-5">{searchNoResultText}</p>
          )}
          {options.map((option, index) => (
            <CommandItem
              key={`${props.setValue(option).toString()}-${index}`}
              value={
                props.setKeyword
                  ? props.setKeyword(option)
                  : props.setLabel(option)
              }
              onSelect={() => {
                if (props.multiple) {
                  const newOption = options.find(
                    (o) => props.setValue(o) === props.setValue(option)
                  );
                  if (newOption) {
                    if (props.value.includes(props.setValue(newOption))) {
                      props.onChange(
                        props.value.filter(
                          (v) => v !== props.setValue(newOption)
                        )
                      );
                    } else {
                      props.onChange([
                        ...props.value,
                        props.setValue(newOption),
                      ]);
                    }
                  }
                } else {
                  const newOption = options.find(
                    (o) => props.setValue(o) === props.setValue(option)
                  );
                  props.onChange(
                    newOption ? props.setValue(newOption) : undefined
                  );
                  setOpen(false);
                }
              }}
            >
              <Fragment>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    (
                      props.multiple
                        ? props.value.includes(props.setValue(option))
                        : props.value === props.setValue(option)
                    )
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
        <CommandOptions
          {...props}
          selectedOptions={selectedOptions}
          setOpen={setOpen}
        />
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
              minWidth: containerRef.current?.offsetWidth,
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
          <DrawerContent className="max-h-[50svh]">
            <Content />
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}
