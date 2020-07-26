import React, { useState, useEffect } from "react";
import copy from "copy-to-clipboard";

import "./styles.less";

export default function App() {
  const [originEmojis, setOriginEmojis] = useState([]);
  const [showEmojis, setShowEmojis] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selected, setSelected] = useState("");

  const fetchEmojis = async () => {
    const res = await fetch(
      "https://raw.githubusercontent.com/github/gemoji/master/db/emoji.json"
    );
    const data = await res.json();
    setShowEmojis(data);
    setOriginEmojis(data);
  };

  useEffect(() => {
    fetchEmojis();
  }, []);

  const handleChangeSearch = e => {
    const v = e.target.value;
    setSearchText(v);
    if (v.length > 1) {
      const filtered = originEmojis.filter(emoji =>
        emoji.aliases[0].includes(v)
      );
      setShowEmojis(filtered);
    } else {
      setShowEmojis(originEmojis);
    }
  };

  const handleClick = item => {
    setSelected(item);
    console.info("You select " + item);
    copy(item);
    setTimeout(() => {
      setSelected("");
    }, 1000);
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Search Emoji</h1>
        <input
          type="search"
          placeholder="Type to search"
          className="search-input"
          value={searchText}
          onChange={handleChangeSearch}
        />
        <div className="emoji-wrapper">
          {showEmojis.length > 0 &&
            showEmojis.map(emoji => (
              <div
                key={emoji.emoji}
                onClick={() => {
                  handleClick(emoji.emoji);
                }}
                className={`emoji-item`}
              >
                {emoji.emoji}&nbsp;&nbsp;
                <span
                  className={`emoji-alias ${
                    selected === emoji.emoji ? "is-selected" : ""
                  }`}
                >
                  :{emoji.aliases[0]}:
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
