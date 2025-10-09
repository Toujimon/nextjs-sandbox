import React, { useState, useEffect, useRef, useMemo } from "react";
import { AnimatedConcealableContent } from "./AnimatedConcealableContent";

const DELAYED_ITEM_STATUS = {
    ENTERING: "ENTERING",
    SETTLED: "SETTLED",
    LEAVING: "LEAVING"
}

class DelayedListManager {
    _list = [];
    _map = {};
    _lastUpdateItems = [];

    constructor(initialItems, getKeyFromItem) {
        this._list = [];
        this._map = {};
        this._lastUpdateItems = initialItems;

        initialItems.forEach(item => {
            const element = ({ item, key: getKeyFromItem(item), status: DELAYED_ITEM_STATUS.SETTLED });
            this._list.push(element);
            this._map[element.key] = element;
        });
    }

    getList() {
        return this._list;
    }

    updateList(updatedItems, getKeyFromItem) {
        if (updatedItems === this._lastUpdateItems) {
            return;
        }
        this._lastUpdateItems = updatedItems;

        const elementsMap = this._map;
        const leavingNodesSet = new Set(Object.keys(elementsMap));

        const newMap = {};
        let newList = [];
        let hasChangedElements = false;
        updatedItems.forEach((item) => {
            const key = getKeyFromItem(item);
            const existingElement = elementsMap[key];
            const newElement = !existingElement ?
                { key, item, status: DELAYED_ITEM_STATUS.ENTERING } :
                item === existingElement.item && existingElement.status !== DELAYED_ITEM_STATUS.LEAVING ?
                    existingElement :
                    {
                        ...existingElement,
                        item,
                        status: existingElement.status !== DELAYED_ITEM_STATUS.LEAVING ?
                            existingElement.status :
                            DELAYED_ITEM_STATUS.SETTLED
                    }

            if (existingElement) {
                leavingNodesSet.delete(key);
            }
            if (newElement !== existingElement) {
                hasChangedElements = true;
            }

            newList.push(newElement);
            newMap[key] = newElement;
        });

        // If no elements have changed nor have been deleted, there are no changes to apply
        if (!hasChangedElements && leavingNodesSet.size === 0) {
            return;
        }

        if (leavingNodesSet.size > 0) {
            const currentListLength = this._list.length;
            for (let i = currentListLength; i > 0; i -= 1) {
                const element = this._list[i - 1];
                if (!leavingNodesSet.has(element.key) || element.status === DELAYED_ITEM_STATUS.ENTERING) {
                    continue;
                }

                const leavingElement = element.status === DELAYED_ITEM_STATUS.LEAVING ? element : { ...element, status: DELAYED_ITEM_STATUS.LEAVING };

                const nextElementKey = this._list[i + 1]?.key ?? null;
                const indexOfNextElement = nextElementKey === null ? -1 : newList.findIndex(newListElement => newListElement.key === nextElementKey);
                if (indexOfNextElement < 0) {
                    newList = [...newList, leavingElement]
                } else {
                    newList = [...newList.slice(0, indexOfNextElement),
                        leavingElement,
                    ...newList.slice(indexOfNextElement)]
                }

                newMap[leavingElement.key] = leavingElement;
            }
        }

        this._list = newList;
        this._map = newMap;
    }

    settleEntering(...keysToSettle) {
        const keys = keysToSettle.filter((key) => this._map[key]?.status === DELAYED_ITEM_STATUS.ENTERING)
        if (!keys.length) {
            return;
        }
        this._list = this._list.map(element => !keys.includes(element.key) ? element : { ...element, status: DELAYED_ITEM_STATUS.SETTLED });
        this._map = this._list.reduce((acc, item) => { acc[item.key] = item; return acc; }, {})
    }

    clearLeaving(...keysToClear) {
        const keys = keysToClear.filter((key) => this._map[key]?.status === DELAYED_ITEM_STATUS.LEAVING)
        if (!keys.length) {
            return;
        }
        this._list = this._list.filter(element => !keys.includes(element.key));
        this._map = this._list.reduce((acc, item) => { acc[item.key] = item; return acc; }, {})
    }
}


export const AnimatedContainer = ({ items, renderItem, getKeyFromItem }) => {

    const wrapperRef = useRef(null);

    const delayedListManager = useMemo(() =>
        new DelayedListManager(items, getKeyFromItem),
        [])

    const [list, setList] = useState(() => delayedListManager.getList());

    const enteringElementsDetector = useMemo(() => new MutationObserver((records) => {
        if (!wrapperRef.current) {
            return;
        }

        const list = delayedListManager.getList();
        const enteringItemsMap = list.reduce((acc, x, index) => {
            if (x.status === DELAYED_ITEM_STATUS.ENTERING) {
                acc[x.key] = index;
            }
            return acc;
        }, {});
        const enteringItemsCount = Object.keys(enteringItemsMap).length;
        const detectedItemsSet = new Set();

        console.log("debug::detected changes in the element. Time to check if the entering elements are there.", enteringItemsMap);

        if (enteringItemsCount && wrapperRef.current.childElementCount === list.length) {
            for (const enteringKey in enteringItemsMap) {
                if (wrapperRef.current.children[enteringItemsMap[enteringKey]]?.getAttribute("data-animated-key") === enteringKey) {
                    detectedItemsSet.add(enteringKey);
                }
            }
        }

        console.log("debug::we could find the next entering items", detectedItemsSet);

        if (detectedItemsSet.size) {
            delayedListManager.settleEntering(...detectedItemsSet);
            setList(delayedListManager.getList());
        }

        if (detectedItemsSet.size === enteringItemsCount) {
            enteringElementsDetector.disconnect();
        }

    }), [])

    useEffect(() => {
        delayedListManager.updateList(items, getKeyFromItem);
        const newList = delayedListManager.getList();
        setList(newList);

        if (newList.find(x => x.status === DELAYED_ITEM_STATUS.ENTERING)) {
            enteringElementsDetector.observe(wrapperRef.current, { childList: true });
        }
    }, [items]);

    return <div ref={wrapperRef}>
        {list.map(({ item, key, status }, index) => <div key={key} data-animated-key={key}>
            <AnimatedConcealableContent
                key={key}
                hidden={status !== DELAYED_ITEM_STATUS.SETTLED}
                onConcealed={() => {
                    delayedListManager.clearLeaving(key);
                    setList(delayedListManager.getList())
                }}>
                {renderItem(item, index)}
            </AnimatedConcealableContent>
        </div>)}
    </div>
}