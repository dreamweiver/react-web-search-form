import React from 'react';

const AutoSuggest = ({suggestions, onSelection}) => {
	if(!!suggestions && suggestions.length > 0) {
		return (
			<div className="autoSuggest">
			{
			 suggestions.map((suggestion, i) => {
				return <div key={i} onClick={onSelection.bind(null, suggestion)} >{suggestion}</div>
			  })
			}
			</div>
		)
	}
	else {
		return null
  	}  
}

export {AutoSuggest}