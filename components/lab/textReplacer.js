import { useState, useMemo } from "react";
import { TextReplacer } from "../textReplacer";

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
