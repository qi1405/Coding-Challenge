import {
  convertFromRaw,
  convertToRaw,
  Editor,
  EditorState,
  RichUtils,
} from 'draft-js';
import React, { useState } from 'react';

import { Wrapper } from './styled';

const handleChange = (setEditorState) => (editorState) =>
  setEditorState(editorState);

const handleClick =
  (handleKeyCommand) =>
  (editorState, setEditorState) =>
  (handleChange) =>
  (commandType) =>
  () => {
    handleKeyCommand(editorState, setEditorState)(handleChange)(commandType);
  };

const handleKeyCommand =
  (editorState, setEditorState) => (handleChange) => (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      handleChange(setEditorState)(newState);
      return true;
    }
    return false;
  };

const getContentAsRawJson = (editorState) => {
  const contentState = editorState.getCurrentContent();
  const raw = convertToRaw(contentState);
  // console.log('raw', raw);
  // console.log('contentState', contentState);
  return JSON.stringify(raw, null, 2);
};

const handleSaveContent = (editorState) => () => {
  // generate json string from the storage
  const json = getContentAsRawJson(editorState);

  // save the json string to localStorage
  localStorage.setItem('DraftEditorContentJson', json);
};

const loadContent = () => {
  const savedData = localStorage.getItem('DraftEditorContentJson');
  return savedData ? JSON.parse(savedData) : null;
};

const handleSetEditorContent = (setEditorState) => () => {
  const rawEditorData = loadContent();
  if (rawEditorData !== null) {
    const contentState = convertFromRaw(rawEditorData);
    const newEditorState = EditorState.createWithContent(contentState);
    setEditorState(newEditorState);
  }
};

const Composer = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  return (
    <div>
      <div style={{ margin: '10px' }}>
        <button
          onClick={handleClick(handleKeyCommand)(editorState, setEditorState)(
            handleChange
          )('bold')}
        >
          Bold
        </button>
        <button
          onClick={handleClick(handleKeyCommand)(editorState, setEditorState)(
            handleChange
          )('italic')}
        >
          Italic
        </button>
        <button
          onClick={handleClick(handleKeyCommand)(editorState, setEditorState)(
            handleChange
          )('underline')}
        >
          Underline
        </button>
        <button
          onClick={handleClick(handleKeyCommand)(editorState, setEditorState)(
            handleChange
          )('code')}
        >
          Code
        </button>
      </div>
      <Wrapper>
        <Editor
          editorState={editorState}
          onChange={handleChange(setEditorState)}
          handleKeyCommand={handleKeyCommand(
            editorState,
            setEditorState
          )(handleChange)}
        />
      </Wrapper>
      <div style={{ margin: '10px' }}>
        <button onClick={handleSaveContent(editorState)}>Save content</button>
        <button onClick={handleSetEditorContent(setEditorState)}>
          Load content
        </button>
      </div>
      {/* <pre>{getContentAsRawJson(editorState)}</pre> */}
    </div>
  );
};

export default Composer;
