"use client";
import { useSearchParams } from "@/hooks/search-params";
import { ComboBox, MultiComboBoxProps } from "../ui/combo-box";
import { useMemo } from "react";

// Assets
import filter from "@/assets/icon/filter.svg";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";

interface DCheckboxDropdownProps<T> extends MultiComboBoxProps<T, string> {
  searchKey: string;
}

type CheckboxDropdownProps<T> = Omit<
  DCheckboxDropdownProps<T>,
  "multiple" | "value" | "onChange" | "clearable"
>;

export function CheckboxDropdown<T>(props: CheckboxDropdownProps<T>) {
  const searchParams = useSearchParams();
  const value = useMemo(() => {
    const value = searchParams.get(props.searchKey);
    return value ? value.split(",") : [];
  }, [searchParams.get(props.searchKey)]);

  const onChange = (value: Array<string>) => {
    if (value.length > 0) searchParams.set(props.searchKey, value.join(","));
    else searchParams.clear(props.searchKey);
  };

  return (
    <ComboBox
      {...props}
      multiple
      value={value}
      onChange={onChange}
      clearable
      classNames={{
        trigger: cn(
          buttonVariants({
            variant: "light",
          }),
          "text-primary hover:text-primary font-medium"
        ),
        drawerTrigger: cn(
          buttonVariants({
            variant: "light",
          }),
          "text-primary hover:text-primary font-medium"
        ),
      }}
      subfixIcon={filter}
      subfix="filter"
    />
  );
}
