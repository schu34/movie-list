import React, { useState } from "react";
import ReactDOM from "react-dom";
import useSuggestion from "./useSuggestion";

import "./styles.css";
import useSuggestion from "./useSuggestion";
const apiUrl = process.env.API_URL || "http://localhost:8080";

const App = () => {
  const [title, setTitle, suggestions] = useSuggestion();
  const [error, setError] = useState();
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
      setError(error);
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
            {suggestions.results.length ? (
              suggestions.results.map((sug) => {
                return <SuggestionResult {...sug} />;
              })
            ) : (
              <div className={"text-danger"}>{error}</div>
            )}
          </div>
        </div>
      </form>

      {/* {JSON.stringify(suggestions, null, 2)} */}
    </div>
  );
};

const SuggestionResult = ({ image, title, description, id }) => {
  return (
    <a href={"https://imdb.com/title/" + id}>
      <div className="row">
        <div className="col-2">
          <img src={image}></img>
        </div>
        <div className="col-10">
          <p>
            {title}: {description}
          </p>
        </div>
      </div>
    </a>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
