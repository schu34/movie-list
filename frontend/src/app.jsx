import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";

import "./styles.css";
const apiUrl = process.env.API_URL || "http://localhost:8080";

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

const cancelableFetch = (url, fetchOpts) => {
  const controller = new AbortController();
  const promise = fetch(url, { ...fetchOpts, signal: controller.signal });
  return { promise, controller };
};

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

const App = () => {
  const [title, setTitle, suggestions] = useSuggestion();
  console.log("render");

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
    <div className={"container"}>
      <form onSubmit={submitForm}>
        <div className={"row"}>
          <div className="col-md-6 col-sm-12">
            <p>
              <label htmlFor="title" className="">
                title
              </label>
            </p>
            <p>
              <input
                id="title"
                autoComplete="false"
                tabIndex="0"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-control"
              />
            </p>
            <input type="submit" value="submit" />
          </div>
          <div className="col-md-6 col-sm-12">
            {suggestions.results.map((sug) => {
              return (
                <div className="row">
                  <div className="col-2">
                    <img src={sug.image}></img>
                  </div>
                  <div className="col-10">
                    <p>
                      {sug.title} ({sug.description})
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </form>

      {JSON.stringify(suggestions, null, 2)}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
