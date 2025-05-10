'use client'

import { useEffect, useState } from "react"

export default function DropDown({initialState, initialOptions, onSelect} : {initialState : string, initialOptions : string[], onSelect: (value : string) => void}) {
    const [ selectedOption, setSelectedOption] = useState<string>(initialState);
    const [ selectableOptions, setSelectableOptions ] = useState<string[]>(initialOptions)
    const [ seeSelectableOptions, setSeeSelectableOptions ] = useState(false);

    function handleOptionClick(e : React.MouseEvent, option : string) {
        e.preventDefault();
        setSelectedOption(option);
        onSelect(option)
    }

    useEffect(() => {
        setSelectableOptions(initialOptions);
    },[initialOptions]);

    return (
        <main className="border rounded w-[80%] m-1"
            onMouseEnter={() => setSeeSelectableOptions(true)}
            onMouseLeave={() => setSeeSelectableOptions(false)}
        >
            <p className="p-1 border-b w-full bg-gradient-to-br from-green-400 text-center">
                {selectedOption}
            </p>
            <ul
                className={`overflow-auto flex flex-col z-1 divide-y transition-all duration-500 
                ${seeSelectableOptions ? "max-h-[20vh]" : "max-h-0"}`}
            >
            {selectableOptions.map((option, index) => (
                <button
                    key={index}
                    onClick={(e) => handleOptionClick(e, option)}
                    type="button"
                    className="hover:cursor-pointer hover:bg-gradient-to-br hover:from-green-200"
                >
                {option}
                </button>
            ))}
            </ul>

        </main>
    )
}