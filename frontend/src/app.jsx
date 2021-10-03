import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";

import "./styles.css";

const apiUrl = process.env.API_URL || "http://localhost:8080";

const cancelableFetch = (url, fetchOpts) => {
  const controller = new AbortController();
  const promise = fetch(url, { ...fetchOpts, signal: controller.signal });
  return { promise, controller };
};

const useSuggestion = () => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState({});
  const promise = useRef(null);
  const abortController = useRef(null);
  const isRequestInProgress = useRef(null);

  const setSearchAndGetSuggestion = (newSearch) => {
    setSearch(newSearch);

    if (isRequestInProgress.current) {
      console.log(promise);
      const controller = abortController.current;
      console.log(controller, controller.abort);

      controller.abort();
    }
    isRequestInProgress.current = true;

    const { promise: fetchPromise, controller } = cancelableFetch(
      apiUrl + "/search/" + newSearch,
      {
        mode: "cors",
        method: "GET",
      }
    );
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
    abortController.current = controller;
  };
  return [search, setSearchAndGetSuggestion, suggestions];
};

const App = () => {
  // const [title, setTitle] = useState("");

  const [title, setTitle, suggestions] = useSuggestion();

  const submitForm = async (e) => {
    console.log("submit working");
    e.preventDefault();

    const finalURL = apiUrl + "/movie";
    console.log(finalURL);
    try {
      const res = await fetch(finalURL, {
        mode: "cors",
        method: "POST",
        body: JSON.stringify({ title }),
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <form onSubmit={submitForm}>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <input
          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
          id="title"
          name="title"
          type="text"
          placeholder="Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* <button type="submit">submit</button> */}
        <input type="submit" value="submit" />
      </form>

      {JSON.stringify(suggestions, null, 2)}
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
