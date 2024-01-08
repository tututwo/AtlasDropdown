import { useEffect, useState } from "react";
import { json, sort } from "d3";
import { sortHierarchy } from "./utility";
import "./App.css";
import Downshift from "downshift";
function App() {
  const [data, setData] = useState(null);
  useEffect(() => {

    const fetchData = async () => {
      const data = await json(
        'https://gist.githubusercontent.com/bleonard33/38a183289ed87082fed7b2547f2eea49/raw/3290b8ea9791c4e632520a9e1849f580bb82346a/census_classification.json'
      );
      setData(sortHierarchy(data));
    }
    fetchData()
  }, []);

  console.log(data)
  const items = [
    { author: "Harper Lee", title: "To Kill a Mockingbird" },
    { author: "Lev Tolstoy", title: "War and Peace" },
    { author: "Fyodor Dostoyevsy", title: "The Idiot" },
    { author: "Oscar Wilde", title: "A Picture of Dorian Gray" },
    { author: "George Orwell", title: "1984" },
    { author: "Jane Austen", title: "Pride and Prejudice" },
    { author: "Marcus Aurelius", title: "Meditations" },
    { author: "Fyodor Dostoevsky", title: "The Brothers Karamazov" },
    { author: "Lev Tolstoy", title: "Anna Karenina" },
    { author: "Fyodor Dostoevsky", title: "Crime and Punishment" },
  ];

  return (
    <Downshift
      onChange={(selection) =>
        alert(
          selection
            ? `You selected "${selection.title}" by ${selection.author}. Great Choice!`
            : "Selection Cleared"
        )
      }
      itemToString={(item) => (item ? item.title : "")}
    >
      {({
        getInputProps,
        getItemProps,
        getLabelProps,
        getMenuProps,
        getToggleButtonProps,
        isOpen,
        inputValue,
        highlightedIndex,
        selectedItem,
        getRootProps,
      }) => (
        <div>
          <div className="w-[500px] flex flex-col gap-1">
            <label {...getLabelProps()}>Select a location:</label>
            <div
              className="flex shadow-sm bg-white gap-0.5"
              {...getRootProps({}, { suppressRefError: true })}
            >
              <input
                placeholder="Please select a county"
                className="w-full p-1.5"
                {...getInputProps()}
              />
              <button
                aria-label={"toggle menu"}
                className="px-2"
                type="button"
                {...getToggleButtonProps()}
              >
                {isOpen ? <>&#8593;</> : <>&#8595;</>}
              </button>
            </div>
          </div>
          <ul
            className={`absolute w-72 bg-white mt-1 shadow-md max-h-80 overflow-scroll p-0 z-10 ${
              !(isOpen && items.length) && "hidden"
            }`}
            {...getMenuProps()}
          >
            {isOpen
              ? items
                  .filter(
                    (item) =>
                      !inputValue ||
                      item.title
                        .toLowerCase()
                        .includes(inputValue.toLowerCase()) ||
                      item.author
                        .toLowerCase()
                        .includes(inputValue.toLowerCase())
                  )
                  .map((item, index) => (
                    <li
                      style={{
                        backgroundColor:
                          highlightedIndex === index && "lightblue",
                        fontWeight: selectedItem === item && "700",
                      }}
                      className="py-2 px-3 shadow-sm flex flex-col"
                      {...getItemProps({
                        key: item.title,
                        index,
                        item,
                      })}
                    >
                      <span>{item.title}</span>
                      <span className="text-sm text-gray-700">
                        {item.author}
                      </span>
                    </li>
                  ))
              : null}
          </ul>
        </div>
      )}
    </Downshift>
  );
}

export default App;
