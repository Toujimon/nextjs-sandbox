import React, { useState, useEffect, useRef, useMemo } from "react";
import { AnimatedConcealableContent } from "./AnimatedConcealableContent";


export const AnimatedContainer = ({ items: itemsProp, renderItem, getKeyFromItem }) => {

    const wrapperRef = useRef(null);

    const [list, setList] = useState(() => {
        return itemsProp.map(item => ({ item, hidden: false, key: getKeyFromItem(item) }));
    });

    // const manager = useMemo(() => ({ newItems: new Set(), keyIndexMap: list.reduce((acc, item, index) => ({ ...acc, [item.key]: index }), {}) }), []);

    // useEffect(() => {
    //     const keySet = new Set(Object.keys(manager.keyIndexMap));
    //     const newItems = {}; 
    //     items.forEach((item) => {
    //         const key = getKeyFromItem(item);

    //     })
    // }, [items])

    return <div ref={wrapperRef}>
        {list.map(({ item, hidden, key }, index) => <AnimatedConcealableContent key={key} hidden={hidden}>
            <div data-animated-key={key}>{renderItem(item, index)}</div>
        </AnimatedConcealableContent>)}
    </div>
}