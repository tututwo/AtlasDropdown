import { useEffect, useState, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { json, sort } from "d3";
import { sortHierarchy } from "./utility";
import "./App.css";
import { useCombobox } from "downshift";
const da = [
  "Neptunium",
  "Plutonium",
  "Americium",
  "Curium",
  "Berkelium",
  "Californium",
  "Einsteinium",
  "Fermium",
  "Mendelevium",
  "Nobelium",
  "Lawrencium",
  "Rutherfordium",
  "Dubnium",
  "Seaborgium",
  "Bohrium",
  "Hassium",
  "Meitnerium",
  "Darmstadtium",
  "Roentgenium",
  "Copernicium",
  "Nihonium",
  "Flerovium",
  "Moscovium",
  "Livermorium",
  "Tennessine",
  "Oganesson",
];
const items = da.map((d, i) => ({ id: i, name: d }));
const menuStyles = {
  maxHeight: 150,
  maxWidth: 300,
  overflowY: "scroll",
  backgroundColor: "#eee",
  padding: 0,
  listStyle: "none",
  position: "relative",
};

function App() {
  const [inputValue, setInputValue] = useState("");

  const listRef = useRef();

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    estimateSize: () => 10,
    overscan: 2,
    getScrollElement: () => listRef.current,
  });
  const {
    getInputProps,
    getItemProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    selectedItem,
    isOpen,
  } = useCombobox({
    items,
    inputValue,
    onInputValueChange: ({ inputValue: newValue }) => setInputValue(newValue),
    scrollIntoView: () => {},
    onHighlightedIndexChange: ({ highlightedIndex, type }) => {
      if (type !== useCombobox.stateChangeTypes.MenuMouseLeave) {
        rowVirtualizer.scrollToIndex(highlightedIndex);
      }
    },
  });
  console.log(rowVirtualizer.getVirtualItems());
  return (
    <div>
      <div>
        <label {...getLabelProps()}>Choose an element:</label>
        <div>
          <input {...getInputProps({ type: "text" })} />
        </div>
      </div>
      <ul {...getMenuProps({ ref: listRef })}>
        {isOpen  && (
          <>
            <li key="total-size" style={{ height: rowVirtualizer.getTotalSize() }} />
            {rowVirtualizer.getVirtualItems().map((virtualRow) => (
              <li
                key={items[virtualRow.index].id} // Use unique id as key
                {...getItemProps({
                  index: virtualRow.index,
                  item: items[virtualRow.index],
                  style: {
                    backgroundColor:
                      highlightedIndex === virtualRow.index
                        ? "lightgray"
                        : "inherit",
                    fontWeight:
                      selectedItem &&
                      selectedItem.id === items[virtualRow.index].id
                        ? "bold"
                        : "normal",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: virtualRow.size,
                    transform: `translateY(${virtualRow.start}px)`,
                  },
                })}
              >
                {items[virtualRow.index].name}
              </li>
            ))}
          </>
        )}
      </ul>
    </div>
  );
}

export default App;
