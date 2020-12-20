"use strict";
const { useState, useRef } = React;

const App = () => {
  const [form, setForm] = useState({ url: "", slug: "" });
  const [response, setResponse] = useState("");
  const [copy, setCopy] = useState(false);
  const urlRef = useRef(null);
  const slugRef = useRef(null);

  return (
    <div
      className="h-screen flex flex-col items-center justify-center text-white w-full"
      style={{ backgroundColor: "#121212" }}
    >
      <div className="text-xl uppercase tracking-widest mb-8">
        url shortener
      </div>
      <form
        className="md:w-3/5 w-full md:px-0 px-4 text-2xl max-w-screen-sm"
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
        <div className="relative">
          <div
            className="absolute right-0 text-gray-500 h-full text-base px-2 bg-white rounded flex items-center cursor-pointer"
            onClick={() => {
              navigator.clipboard.readText().then((res) => {
                urlRef.currentTarget.value = res;
                setForm((f) => ({ ...f, url: res }));
              });
            }}
          >
            <div className="rounded border border-gray-500 px-2 py-1 transition duration-300 ease-in-out hover:bg-gray-500 hover:text-white">
              PASTE
            </div>
          </div>
          <input
            ref={urlRef}
            name="url"
            type="text"
            placeholder="paste url here"
            className="w-full h-12 text-gray-900 px-4"
            required
            onChange={(e) => {
              setForm((f) => ({ ...f, url: e.currentTarget.value }));
            }}
          />
        </div>
        <div className="mt-2 text-sm text-gray-300">
          Customize your link (optional)
        </div>
        <div className="flex items-center w-full h-10 px-4 bg-white text-gray-900 text-xl rounded">
          <div
            className="text-gray-500"
            onClick={() => slugRef.current.focus()}
          >
            go.inregist.dev/
          </div>
          <input
            ref={slugRef}
            name="slug"
            type="text"
            className="w-full"
            onChange={(e) => {
              const newSlug = e.currentTarget.value.replace(/\s/g, "");
              e.currentTarget.value = newSlug;
              setForm((f) => ({
                ...f,
                slug: newSlug,
              }));
            }}
          />
        </div>
        <div className="flex items-center justify-between mt-4 md:flex-row flex-col">
          <div className="flex-1 md:mr-2 h-full">
            {response ? (
              <div className="flex items-center justify-between md:flex-row flex-col text-gray-300 text-lg h-full">
                <div className="flex">
                  <span className="md:block hidden mr-2">
                    {"your short link:"}
                  </span>
                  <span
                    className="text-white underline cursor-pointer"
                    onClick={() => {
                      setCopy(true);
                      navigator.clipboard.writeText(response);
                      setTimeout(() => {
                        setCopy(false);
                      }, 3000);
                    }}
                  >
                    {response}
                  </span>
                </div>
                <div
                  className="border border-gray-500 cursor-pointer px-2 py-1 rounded transition duration-300 in-ease-out hover:bg-gray-300 hover:text-gray-900 md:mt-0 mt-4"
                  onClick={() => {
                    setCopy(true);
                    navigator.clipboard.writeText(response);
                    setTimeout(() => {
                      setCopy(false);
                    }, 3000);
                  }}
                >
                  {!copy ? "copy link" : "copied"}
                </div>
              </div>
            ) : (
              <div />
            )}
          </div>
          <button
            type="submit"
            onClick={() => console.log("click")}
            className="rounded border text-lg border-white px-4 py-1 transition duration-300 ease-in-out hover:bg-white hover:text-gray-900 md:mt-0 mt-4"
          >
            GO
          </button>
        </div>
      </form>
    </div>
  );
};

const domContainer = document.querySelector("#root");
ReactDOM.render(<App />, domContainer);
