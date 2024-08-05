import React, { useState } from 'react';

const USSDPreview = ({ menuOptions, menuData }) => {
  const [currentMenuId, setCurrentMenuId] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState([]);
  const [isEnded, setIsEnded] = useState(false);
  const [expectingInput, setExpectingInput] = useState(false);
  const [currentInputOption, setCurrentInputOption] = useState(null);

  const renderOptions = (options, parentId = null) => {
    return options
      .filter(option => option.parent_option === parentId)
      .map((option, index) => (
        <div key={option.id} className="mb-2">
          <span className="font-mono">{index + 1}. {option.name}</span>
        </div>
      ));
  };

  const moveToNextMenu = (optionId) => {
    const hasSubOptions = menuOptions.some(option => option.parent_option === optionId);
    if (hasSubOptions) {
      setCurrentMenuId(optionId);
    } else {
      setIsEnded(true);
    }
  };

  const handleInput = (e) => {
    e.preventDefault();
    if (isEnded) {
      // Start over
      setCurrentMenuId(null);
      setHistory([]);
      setIsEnded(false);
      setInputValue('');
      setExpectingInput(false);
      setCurrentInputOption(null);
      return;
    }

    if (expectingInput) {
      // Handle the input for the option that expects input
      setHistory([...history, { id: currentInputOption.id, name: `${currentInputOption.name}: ${inputValue}` }]);
      setExpectingInput(false);
      moveToNextMenu(currentInputOption.id);
      setCurrentInputOption(null);
      setInputValue('');
      return;
    }

    const selectedIndex = parseInt(inputValue) - 1;
    const currentOptions = menuOptions.filter(option => option.parent_option === currentMenuId);

    if (selectedIndex >= 0 && selectedIndex < currentOptions.length) {
      const selectedOption = currentOptions[selectedIndex];
      
      if (selectedOption.expects_input) {
        setExpectingInput(true);
        setCurrentInputOption(selectedOption);
        setHistory([...history, { id: currentMenuId, name: selectedOption.name }]);
      } else {
        setHistory([...history, { id: currentMenuId, name: selectedOption.name }]);
        moveToNextMenu(selectedOption.id);
      }
    } else if (inputValue === '0' && history.length > 0) {
      // Go back
      const newHistory = [...history];
      newHistory.pop();
      setCurrentMenuId(newHistory.length > 0 ? newHistory[newHistory.length - 1].id : null);
      setHistory(newHistory);
    } else if (inputValue === '00') {
      // Go to main menu
      setCurrentMenuId(null);
      setHistory([]);
    }

    setInputValue('');
  };

  const currentOptions = menuOptions.filter(option => option.parent_option === currentMenuId);

  const renderContent = () => {
    if (isEnded) {
      return (
        <div>
          <div className="mb-4">End of menu. Thank you for using our service.</div>
          <div>Press any key to start over.</div>
        </div>
      );
    }

    if (expectingInput) {
      return (
        <div className="mb-4">
          {currentInputOption.name}:
        </div>
      );
    }

    return (
      <>
        {currentMenuId === null ? (
          <div className="mb-4">Welcome to {menuData?.name}. Please select an option:</div>
        ) : (
          <div className="mb-4">Please select an option below:</div>
        )}
        {renderOptions(currentOptions, currentMenuId)}
        <div className="mt-4 border-t border-green-400 pt-2">
          <span className="text-xs">0. Back 00. Main Menu</span>
        </div>
      </>
    );
  };

  return (
    <div className="bg-gray-800 text-green-400 p-4 rounded-lg font-mono text-sm">
      <div className="mb-4 border-b border-green-400 pb-2">
        <span className="font-bold">{menuData?.name || 'USSD Menu'}</span>
      </div>
      {history.map((item, index) => (
        <div key={index} className="mb-2 text-yellow-400">
          {item.name}
        </div>
      ))}
      {renderContent()}
      <form onSubmit={handleInput} className="mt-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="bg-gray-700 text-green-400 p-2 rounded w-full"
          placeholder={expectingInput ? "Enter your input" : "Enter your choice"}
        />
        <button type="submit" className="mt-2 bg-green-500 text-white p-2 rounded w-full">
          Submit
        </button>
      </form>
    </div>
  );
};

export default USSDPreview;