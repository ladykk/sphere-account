"use client";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { useSearchParams } from "@/hooks/search-params";

// Assets
import search from "@/assets/icon/search.svg";

type SearchKeywordInputProps = {
  className?: string;
  placeholder?: string;
  delay?: number;
};
export const SearchKeywordInput = (props: SearchKeywordInputProps) => {
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("keyword") ?? "");

  // Debounce keyword
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log("keyword", keyword);
      if (keyword) searchParams.set("keyword", keyword);
      else searchParams.clear("keyword");
    }, props.delay ?? 1000);
    return () => clearTimeout(timeout);
  }, [keyword]);

  return (
    <Input
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
      placeholder={props.placeholder ?? "Search..."}
      subfixIcon={search}
      className="min-w-80 border-border"
    />
  );
};
