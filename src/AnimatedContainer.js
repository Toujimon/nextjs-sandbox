import React, { useState, useEffect } from "react";

const STATUS = {
    NEW: "NEW",
    ENTERING: "ENTERING",
    STABLE: "STABLE",
    LEAVING: "LEAVING",
    GONE: "GONE"
}

export const AnimatedContainer = ({ items: itemsProp, renderItem, getKeyFromItem }) => {

    // const [items, setItems] = useState(() => {
    //     return itemsProp.map(item => ({ item, status: STATUS.STABLE, key: getKeyFromItem(item) }));
    // });

    // useEffect(()=>{
    //     let i = 0,j = 0;
    //     for(i = 0;i<itemsProp.length)

    // }, [itemsProp]);

    return <div>

    </div>

}