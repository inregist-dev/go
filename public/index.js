"use strict";
const { useState } = React;

const App = () => {
  const [form, setForm] = useState({ url: "", slug: "" });
  const [response, setResponse] = useState("");

  return (
    <div
      className="h-screen flex flex-col items-center justify-center text-white w-full"
      style={{ backgroundColor: "#121212" }}
    >
      <div className="text-xl uppercase tracking-widest mb-8">
        url shortener
      </div>
      <form
        className="w-72"
        onSubmit={(e) => {
          e.preventDefault();
          fetch("/url", {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
          })
            .then((res) => res.json())
            .then(({ message }) => setResponse(message));
        }}
      >
        <div className="">
          <div className="flex items-center">
            <span className="mr-4">URL: </span>
            <input
              name="url"
              type="text"
              className="text-gray-900 text-base px-2 min-w-0 flex-1"
              required
              onChange={(e) => {
                setForm((f) => ({ ...f, url: e.target.value }));
              }}
            />
          </div>
          <div className="text-center my-2">V</div>
          <div className="flex items-center w-4/5 mx-auto">
            <span className="mr-1"> go.inregist.dev/ </span>
            <input
              name="slug"
              type="text"
              className="text-gray-900 text-base px-2 min-w-0"
              onChange={(e) => {
                setForm((f) => ({ ...f, slug: e.target.value }));
              }}
            />
          </div>
        </div>
        <div className="text-center">
          <button
            type="submit"
            onClick={() => console.log("click")}
            className="border border-white px-4 py-1 mt-6"
          >
            GO
          </button>
        </div>
      </form>
      <div className="h-12 mt-12">{response ? `result: ${response}` : " "}</div>
    </div>
  );
};

const domContainer = document.querySelector("#root");
ReactDOM.render(<App />, domContainer);
