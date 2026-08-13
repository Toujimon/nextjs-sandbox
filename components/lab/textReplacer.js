import { useState, useMemo } from "react";

function TextReplacer() {
    const [mainText, setMainText] = useState("");
    const [extraTexts, setExtraTexts] = useState([]);
    const [replacements, setReplacements] = useState([]);

    const replacedText = useMemo(() => replacements.reduce((acc, [searchValue, replaceValue, allCaps]) => {
        return searchValue.trim() ? acc.replaceAll(searchValue.trim(), allCaps ? replaceValue.toLocaleUpperCase() : replaceValue) : acc;
    }, mainText), [mainText, replacements]);

    const replacedExtraTexts = useMemo(() => extraTexts.map(extraText => replacements.reduce((acc, [searchValue, replaceValue, allCaps]) => {
        return searchValue.trim() ? acc.replaceAll(searchValue.trim(), allCaps ? replaceValue.toLocaleUpperCase() : replaceValue) : acc;
    }, extraText), [extraTexts, replacements]));

    return <div>
        <div>
            <button type="button" onClick={() => setReplacements(prev => [...prev, ["", "-replace-", false]])}>Add replacement</button>
            {replacements.map(([searchValue, replaceValue, allCaps], index) => <div key={index}>
                <input type="text" name={`${index}_search`} value={searchValue} onChange={(e) => setReplacements(prev => [...prev.slice(0, index), [e.target.value, prev[index][1], prev[index][2]], ...prev.slice(index + 1)])} />
                <input type="text" name={`${index}_value`} value={replaceValue} onChange={(e) => setReplacements(prev => [...prev.slice(0, index), [prev[index][0], e.target.value, prev[index][2]], ...prev.slice(index + 1)])} />
                <input type="checkbox" name={`${index}_all_caps`} checked={allCaps} onChange={(e) => setReplacements(prev => [...prev.slice(0, index), [prev[index][0], prev[index][1], e.target.checked], ...prev.slice(index + 1)])} />

                <button type="button" onClick={() => setReplacements(prev => [...prev.slice(0, index), ...prev.slice(index + 1)])}>X</button>
            </div>)}
        </div>
        <div>
            <div style={{ display: "flex", overflow: "auto" }}>
                <textarea style={{ flex: "1 1 auto" }} value={mainText} onChange={e => setMainText(e.target.value)} />
                <button style={{ flex: "0 0 auto" }} type="button" onClick={() => setExtraTexts(prev => [...prev, ""])}>+</button>
            </div>
            <pre style={{ padding: "8px", border: "1px solid black" }}>
                {replacedText}
            </pre>
            <button type="button" onClick={() => navigator.clipboard.writeText(replacedText)}>Copy replaced text</button>
        </div>
        {extraTexts.map((text, index) => <div key={index}>
            <div style={{ display: "flex" }}>
                <textarea style={{ flex: "1 1 auto" }} value={text} onChange={e => setExtraTexts(prev => [...prev.slice(0, index), e.target.value, ...prev.slice(index + 1)])} />
                <button style={{ flex: "0 0 auto" }} type="button" onClick={() => setExtraTexts(prev => [...prev.slice(0, index), ...prev.slice(index + 1)])}>X</button>
            </div>
            <pre style={{ padding: "8px", border: "1px solid black" }}>
                {replacedExtraTexts[index]}
            </pre>
            <button type="button" onClick={() => navigator.clipboard.writeText(replacedExtraTexts[index])}>Copy replaced text ({index + 1})</button>
        </div>)}
    </div>
}


export default function TextReplacerSample() {
    const [replacers, setReplacers] = useState(() => [new Date().getTime()]);

    return (
        <article>
            <h2>Text replacement</h2>
            <p>
                Simple system to replace specific text elements.
            </p>
            <div>
                <button type="button" onClick={() => setReplacers(prev => [...prev, new Date().getTime()])}>Add replacer</button>
            </div>
            {replacers.map((key, index) => <div key={key} style={{ border: "1px solid black", padding: "8px" }}>
                <TextReplacer />
                <button style={{ marginTop: "16px" }} type="button" onClick={() => setReplacers(prev => [...prev.slice(0, index), ...prev.slice(index + 1)])}>Remove replacer</button>
            </div>)}
        </article>
    );
}
