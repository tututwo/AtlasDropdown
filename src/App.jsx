import { useEffect, useState, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { json, scaleOrdinal } from "d3";
import { sortHierarchy } from "./utility";
import "./App.css";
import { useCombobox } from "downshift";
const regionScale = scaleOrdinal(["region", "state", "county"], [0, 20, 40]);
function App() {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await json(
        "https://gist.githubusercontent.com/bleonard33/38a183289ed87082fed7b2547f2eea49/raw/3290b8ea9791c4e632520a9e1849f580bb82346a/census_classification.json"
      );
      setData(sortHierarchy(data));
    };
    fetchData();
  }, []);
  function getDataFilter(inputValue) {
    const lowerCasedInputValue = inputValue.toLowerCase();

    return function dataFilter(book) {
      return (
        !inputValue || book.name.toLowerCase().includes(lowerCasedInputValue)
      );
    };
  }

  function ComboBox() {
    const [items, setItems] = useState(data);
    const listRef = useRef();
    const rowVirtualizer = useVirtualizer({
      count: items.length,
      estimateSize: () => 100,
      overscan: 2,
      getScrollElement: () => listRef.current,
    });
    const {
      isOpen,
      getToggleButtonProps,
      getLabelProps,
      getMenuProps,
      getInputProps,
      highlightedIndex,
      getItemProps,
      selectedItem,
    } = useCombobox({
      items,
      onInputValueChange({ inputValue }) {
        setItems(data.filter(getDataFilter(inputValue)));
      },
      itemToString(item) {
        return item ? item.name : "";
      },
      scrollIntoView() {},
      onHighlightedIndexChange: ({ highlightedIndex, type }) => {
        if (type !== useCombobox.stateChangeTypes.MenuMouseLeave) {
          rowVirtualizer.scrollToIndex(highlightedIndex);
        }
      },
    });

    return (
      <div>
        <div className="w-72 flex flex-col gap-1">
          <label className="w-fit" {...getLabelProps()}>
            Select your favorite location:
          </label>
          <div className="flex shadow-sm bg-white gap-0.5">
            <input
              placeholder="Please select a county"
              className="w-full p-1.5"
              {...getInputProps()}
            />
            <button
              aria-label="toggle menu"
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
          {...getMenuProps({ ref: listRef })}
        >
          {isOpen && (
            <>
              <li
                key="total-size"
                style={{ height: rowVirtualizer.getTotalSize() }}
              />
              {rowVirtualizer.getVirtualItems().map((virtualRow) => (
                <li
                  className="py-2 px-3 shadow-sm flex flex-col"
                  key={items[virtualRow.index].id}
                  {...getItemProps({
                    index: virtualRow.index,
                    item: items[virtualRow.index],
                  })}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: virtualRow.size,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <div className="flex">
                    {/* <!-- Gap --> */}
                    <div className=""style={{
    marginLeft: `${regionScale(items[virtualRow.index].name)}px`
  }}>
                      <div className=""></div>
                    </div>
                    {/* <!-- Text --> */}
                    <div className="hover:cursor-pointer">{items[virtualRow.index].name}</div>
                  </div>
                  {/* <span>{items[virtualRow.index].name}</span> */}
                  {/* <span className="text-sm text-gray-700">
                    {items[virtualRow.index].author}
                  </span> */}
                </li>
              ))}
            </>
          )}
        </ul>
      </div>
    );
  }
  return <ComboBox />;
}

export default App;
