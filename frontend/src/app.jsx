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
    body,
  });

  return await fetchRes.json();
};

const makeChangeListener = (stateSetter) => (e) => stateSetter(e.target.value);

const App = () => {
  const [title, setTitle, suggestions] = useSuggestion();
  const [error, setError] = useState();
  const [recommender, setRecommender] = useState("");
  const [tags, setTags] = useState("");
  const [isTv, setIsTv] = useState(false);

  return (
    <div className={"container"}>
      <div className={"row"}>
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
            suggestions.results.map((sug) => {
              const onAdd = () => {
                postForm({
                  ...sug,
                  recommender,
                  tags: tags.split(" "),
                  contentType: isTv ? "tv_show" : "movie",
                });
              };

              return <SuggestionResult {...sug} onAdd={onAdd} />;
            })
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
