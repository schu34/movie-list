import React, { useState } from "react";
import ReactDOM from "react-dom";
import useSuggestion from "./useSuggestion";

import "./styles.css";
import useSuggestion from "./useSuggestion";
const apiUrl = process.env.API_URL || "http://localhost:8080";

const postForm = async (body) => {
  const fetchRes = await fetch(`${apiUrl}/movie`, {
    mode: "cors",
    method: "POST",
    body: JSON.stringify(body),
  });

  return await fetchRes.json();
};

const makeChangeListener = (stateSetter) => (e) => stateSetter(e.target.value);

const App = () => {
  const [title, setTitle, suggestions] = useSuggestion();
  const [error, setError] = useState();
  const [postResult, setPostResult] = useState();
  const [recommender, setRecommender] = useState("");
  const [tags, setTags] = useState("");
  const [isTv, setIsTv] = useState(false);

  const makeAddFunction = (suggestion) => async () => {
    try {
      const result = await postForm({
        Id: suggestion.id,
        Title: suggestion.title,
        Recommender: recommender,
        Tags: tags.split(" "),
        ContentType: isTv ? "tv_show" : "movie",
      });

      console.log("result", result);
      setPostResult("success");
    } catch (e) {
      setError("failed to add to list: " + e.message);
    }
  };

  return (
    <div className={"container"}>
      {error && (
        <div className="row">
          <div className="col-md-12">
            <div className={"text-danger"}>{error}</div>
          </div>
        </div>
      )}
      {postResult && (
        <div className="row">
          <div className="col-md-12">
            <div className={"text-success"}>{postResult}</div>
          </div>
        </div>
      )}
      <div className="row">
        <div className="col-md-6 col-sm-12">
          <div className="mb-3">
            <p>
              <label htmlFor="title" className="">
                Title
              </label>
            </p>
            <input
              id="title"
              autoComplete="false"
              tabIndex="0"
              type="text"
              value={title}
              onChange={makeChangeListener(setTitle)}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <p>
              <label htmlFor="recommender" className="">
                Recommender
              </label>
            </p>
            <input
              id="recommender"
              type="text"
              tabIndex="1"
              value={recommender}
              autoComplete="false"
              onChange={makeChangeListener(setRecommender)}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <p>
              <label htmlFor="tags" className="">
                Tags
              </label>
            </p>
            <input
              id="tags"
              type="text"
              tabIndex="1"
              value={tags}
              autoComplete="false"
              onChange={makeChangeListener(setTags)}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <input
              id="tags"
              type="checkbox"
              tabIndex="1"
              value={isTv}
              autoComplete="false"
              onChange={makeChangeListener(setIsTv)}
              className="form-check-input"
            />
            <label htmlFor="tags" className="">
              {" "}
              Tv show?
            </label>
          </div>
        </div>
        <div className="col-md-6 col-sm-12">
          {suggestions?.results?.length ? (
            suggestions.results.map((suggestion) => (
              <SuggestionResult
                {...suggestion}
                onAdd={makeAddFunction(suggestion)}
              />
            ))
          ) : (
            <div className={"text-danger"}>{error}</div>
          )}
        </div>
      </div>
    </div>
  );
};

const SuggestionResult = ({ image, title, description, id, onAdd }) => {
  return (
    <div className="row">
      <div className="col-2">
        <img src={image}></img>
      </div>
      <div className="col-10">
        <a href={"https://imdb.com/title/" + id}>
          <p>
            {title}: {description}
          </p>
        </a>
        <button onClick={onAdd}> add </button>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
