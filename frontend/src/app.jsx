import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

const App = () => {
  return (
    <form>
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
      />

      <button type="submit">submit</button>
    </form>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
