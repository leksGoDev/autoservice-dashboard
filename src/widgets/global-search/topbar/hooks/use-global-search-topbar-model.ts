import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useGlobalSearchQuery } from "@/entities/search/api/queries";
import { getGlobalSearchResultPath } from "@/entities/search/model/navigation";
import type { GlobalSearchResult } from "@/entities/search/model/types";
import { DEFAULT_GLOBAL_SEARCH_LIMIT } from "@/shared/api/constants";

const SEARCH_DEBOUNCE_MS = 280;
const MIN_QUERY_LENGTH = 2;

export type GlobalSearchDropdownStatus = "loading" | "shortQuery" | "error" | "empty" | "ready";

function getDropdownStatus(params: {
  showDropdown: boolean;
  shouldSearch: boolean;
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
}): GlobalSearchDropdownStatus {
  if (!params.showDropdown) {
    return "shortQuery";
  }

  if (params.isLoading) {
    return "loading";
  }

  if (!params.shouldSearch) {
    return "shortQuery";
  }

  if (params.isError) {
    return "error";
  }

  if (params.isEmpty) {
    return "empty";
  }

  return "ready";
}

export function useGlobalSearchTopbarModel() {
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedQuery(query);
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [query]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (!rootRef.current?.contains(target)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  const normalizedQuery = debouncedQuery.trim();
  const shouldSearch = normalizedQuery.length >= MIN_QUERY_LENGTH;

  const searchQuery = useGlobalSearchQuery(
    shouldSearch
      ? {
          query: normalizedQuery,
          limit: DEFAULT_GLOBAL_SEARCH_LIMIT,
        }
      : undefined,
  );

  const items = searchQuery.data?.items ?? [];

  useEffect(() => {
    if (items.length === 0) {
      setActiveIndex(-1);
      return;
    }

    setActiveIndex((currentValue) => {
      if (currentValue < 0 || currentValue >= items.length) {
        return 0;
      }

      return currentValue;
    });
  }, [items]);

  const showDropdown = isOpen && query.trim().length > 0;
  const isLoading = showDropdown && shouldSearch && (searchQuery.isLoading || searchQuery.isFetching);
  const isError = showDropdown && shouldSearch && searchQuery.isError;
  const isEmpty = showDropdown && shouldSearch && !isLoading && !isError && items.length === 0;
  const activeItem = activeIndex >= 0 ? items[activeIndex] : undefined;
  const activeOptionId = activeItem ? `global-search-option-${activeItem.id}` : undefined;

  const close = () => {
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const selectResult = (result: GlobalSearchResult) => {
    navigate(getGlobalSearchResultPath(result));
    setQuery("");
    setDebouncedQuery("");
    close();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      close();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);

      if (items.length === 0) {
        return;
      }

      setActiveIndex((currentValue) => (currentValue + 1 + items.length) % items.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setIsOpen(true);

      if (items.length === 0) {
        return;
      }

      setActiveIndex((currentValue) => {
        if (currentValue < 0) {
          return items.length - 1;
        }

        return (currentValue - 1 + items.length) % items.length;
      });
      return;
    }

    if (event.key === "Enter" && activeIndex >= 0 && activeIndex < items.length) {
      event.preventDefault();
      selectResult(items[activeIndex]);
    }
  };

  const dropdownStatus = getDropdownStatus({
    showDropdown,
    shouldSearch,
    isLoading,
    isError,
    isEmpty,
  });

  const openDropdown = () => {
    setIsOpen(true);
  };

  const handleQueryChange = (nextQuery: string) => {
    setQuery(nextQuery);
    openDropdown();
  };

  const handleInputFocus = () => {
    if (query.trim().length > 0) {
      openDropdown();
    }
  };

  return {
    rootRef,
    input: {
      query,
      activeOptionId,
      isExpanded: showDropdown,
      handleQueryChange,
      handleInputFocus,
      handleKeyDown,
    },
    dropdown: {
      isVisible: showDropdown,
      status: dropdownStatus,
      retry: searchQuery.refetch,
    },
    results: {
      items,
      activeIndex,
      setActiveIndex,
      selectResult,
    },
  };
}
