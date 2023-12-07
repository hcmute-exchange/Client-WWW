import React, { useState } from 'react';
import { WithContext as ReactTags, type Tag } from 'react-tag-input';

const KeyCodes = {
  comma: 188,
  enter: 13,
};
type Props = {
  suggestion: Tag[] | undefined;
  tags: Tag[];
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

export default function TagBuilder({ suggestion, tags, setTags }: Props) {
  const handleDelete = (i: any) => {
    setTags(tags.filter((tag: any, index: any) => index !== i));
  };

  const handleAddition = (tag: any | never) => {
    setTags([...tags, tag]);
  };

  const handleDrag = (tag: any, currPos: any, newPos: any) => {
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    setTags(newTags);
  };

  const handleTagClick = (index: any) => {
    console.log('The tag at index ' + index + ' was clicked');
  };
  function handleFilterSuggestions(
    textInputValue: any,
    possibleSuggestionsArray: any
  ) {
    var lowerCaseQuery = textInputValue.toLowerCase();

    return possibleSuggestionsArray.filter(function (suggestion: any) {
      return suggestion.text.toLowerCase().includes(lowerCaseQuery);
    });
  }

  return (
    <ReactTags
      tags={tags}
      suggestions={suggestion}
      handleFilterSuggestions={handleFilterSuggestions}
      delimiters={delimiters}
      handleDelete={handleDelete}
      handleAddition={handleAddition}
      handleDrag={handleDrag}
      handleTagClick={handleTagClick}
      inputFieldPosition="bottom"
      classNames={{
        tags: 'flex-col gap-2 w-full list-none [&_li]:list-none',
        tag: 'px-2 border border-solid border-primary-300 rounded text-primary-950 list-none',
        tagInput: 'flex flex-col gap-2 list-none',
        tagInputField: 'c-input w-full list-none',
        suggestions:
          'list-none flex px-1 [&_mark]:bg-transparent rounded [&_ul]:flex [&_ul]:gap-2 [&_li]:p-0 [&_li]:px-2 [&_mark]:pr-1 w-fit [&_li]:border [&_li]:border-solid [&_li]:border-primary-300 [&_li]:rounded',
        activeSuggestion: 'bg-primary-50',
        selected: 'list-none',
      }}
      autocomplete
    />
  );
}
