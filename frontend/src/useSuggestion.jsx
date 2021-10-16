import { useState, useRef } from "react";

const debounce = (func, time) => {
  let timer = null;

  const debouncedFunc = (...args) => {
    return new Promise((resolve, reject) => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        const ret = func(...args);
        if (ret.toString() === "[object Promise]") {
          ret.then(resolve).catch(reject);
        } else {
          resolve(ret);
        }
      }, time);
    });
  };

  return debouncedFunc;
};

const debouncedFetch = debounce(fetch, 500);

const useSuggestion = () => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState({ results: [] });
  const promise = useRef(null);
  const abortController = useRef(null);
  const isRequestInProgress = useRef(null);

  const setSearchAndGetSuggestion = (newSearch) => {
    setSearch(newSearch);

    isRequestInProgress.current = true;

    const fetchPromise = debouncedFetch("/search/" + newSearch, {
      // mode: "cors",
      method: "GET",
    });
    promise.current = fetchPromise
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        isRequestInProgress.current = false;
        setSuggestions(json);
        return;
      })
      .catch((e) => {
        isRequestInProgress.current = false;
        console.error(e);
      });
  };
  return [search, setSearchAndGetSuggestion, suggestions];
};

export default useSuggestion;
