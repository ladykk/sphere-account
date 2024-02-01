"use client";
import { useSearchParams } from "@/hooks/search-params";
import { ComboBox, MultiComboBoxProps } from "../ui/combo-box";
import { useMemo } from "react";

// Assets
import filter from "@/assets/icon/filter.svg";

interface DCheckboxDropdownProps<T> extends MultiComboBoxProps<T, string> {
  key: string;
}

type CheckboxDropdownProps<T> = Omit<
  DCheckboxDropdownProps<T>,
  "multiple" | "value" | "onChange" | "clearable"
>;

export function CheckboxDropdown<T>(props: CheckboxDropdownProps<T>) {
  const searchParams = useSearchParams();
  const value = useMemo(() => {
    const value = searchParams.get(props.key);
    return value ? value.split(",") : [];
  }, [searchParams.get(props.key)]);

  const onChange = (value: Array<string>) => {
    if (value.length > 0) searchParams.set(props.key, value.join(","));
    else searchParams.clear(props.key);
  };

  return (
    <ComboBox
      {...props}
      multiple
      value={value}
      onChange={onChange}
      clearable
      classNames={{
        trigger: "text-primary hover:text-primary font-medium",
      }}
      subfixIcon={filter}
      subfix="filter"
    />
  );
}
