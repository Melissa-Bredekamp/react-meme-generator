import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

export function App() {
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');

  const defaultAvailableImageNames = ['doge', 'buzz'];
  const [availableImageNames, setAvailableImageNames] = useState(
    defaultAvailableImageNames,
  );
  const [selectedImageName, setSelectedImageName] = useState(
    availableImageNames[0],
  );

  // Stretch goal: change special characters
  const transformInputToUrl = (inputValue) => {
    return inputValue
      .replace('_', '__')
      .replace(' ', '_')
      .replace('-', '--')
      .replace('?', '~q')
      .replace('%', '~p')
      .replace('#', '~h')
      .replace('/', '~s')
      .replace('"', "''");
  };

  useEffect(() => {
    console.log('D', Date.now());
    axios('https://api.memegen.link/templates/').then((result) => {
      console.log(result);
      if (result.status === 200 && result.data) {
        const availableImageNames = result.data.map((template) => template.key);
        setAvailableImageNames(availableImageNames);
      }
    });
  }, []);

  const imageUrl = `https://api.memegen.link/images/${selectedImageName}/${transformInputToUrl(
    topText,
  )}/${transformInputToUrl(bottomText)}.png`;

  return (
    <div>
      <form>
        <h1>Meme Generator</h1>
        <label>Select a template: </label>
        <select
          className="memeImage"
          onChange={(e) => setSelectedImageName(e.target.value)}
          value={selectedImageName}
        >
          {availableImageNames.map((imageName) => (
            <option key={imageName} value={imageName}>
              {imageName}
            </option>
          ))}
        </select>

        <div className="lowerbuttons">
          <div>
            <input
              placeholder="top text"
              value={topText}
              onChange={(e) => setTopText(e.target.value)}
            />
            <input
              placeholder="bottom text"
              value={bottomText}
              onChange={(e) => setBottomText(e.target.value)}
            />
          </div>
        </div>
      </form>

      <img
        className="Image"
        alt={`Meme ${selectedImageName} with top text "${topText}" and bottom text "${bottomText}"`}
        src={imageUrl}
      />

      <div className="formspecs">
        <button
          type="submit"
          onClick={(e) => {
            let selectedImageIndex = availableImageNames.indexOf(
              selectedImageName,
            );
            let newIndex = (selectedImageIndex += 1);
            if (newIndex >= availableImageNames.length) {
              newIndex = 0;
            }
            setSelectedImageName(availableImageNames[newIndex]);
          }}
        >
          next
        </button>

        <button
          onClick={(e) => {
            fetch(imageUrl).then((response) => {
              response.blob().then((blob) => {
                let dataUrl = window.URL.createObjectURL(blob);
                let linkTag = document.createElement('a');
                linkTag.href = dataUrl;
                linkTag.download = `${selectedImageName}.jpg`;
                linkTag.click();
              });
            });
          }}
        >
          Download Meme
        </button>
      </div>
    </div>
  );
}

export default App;
