'use client'

import { useState, useMemo } from "react";
import styled from "styled-components";
import { useTimer } from "../src/useTimer";

const StyledReplacerContainer = styled.div({
    display: "flex",
    flexDirection: "column",
    gap: "16px"
})

const StyledLabel = styled.span({
    fontSize: "14px",
    fontWeight: "bolder"
})

const StyledSimpleContainer = styled.div(({ $direction = "column", $alignItems, $justifyContent }) => ({
    display: "flex",
    flexDirection: $direction,
    alignItems: $alignItems ?? ($direction === "column" ? "stretch" : "center"),
    gap: "8px",
    ...($justifyContent ? { justifyContent: $justifyContent } : {})
}))

const StyledReplacementsTable = styled.div({
    display: "grid",
    gridTemplate: "auto / auto auto min-content min-content 1fr",
    gridAutoFlow: "row",
    gridAutoRows: "auto",
    columnGap: "8px",
    rowGap: "4px",
});

const StyledReplacementsRow = styled.div({
    gridColumn: "1 / span 5",
    display: "grid",
    gridTemplateColumns: "subgrid",
    alignItems: "center",
})

const StyledTextsTable = styled.div({
    display: "grid",
    gridTemplate: "auto / 1fr min-content",
    gridAutoFlow: "row",
    gridAutoRows: "auto",
    gap: "8px",
    maxWidth: "100%",
    overflow: "hidden",
})

const StyledTextsRow = styled.div(({$odd = false}) => ({
    gridColumn: "1 / span 2",
    display: "grid",
    gridTemplateColumns: "subgrid",
    gridTemplateRows: "auto auto",
    rowGap: "4px",
    alignItems: "start",
    maxWidth: "100%",
    ...($odd?{
        backgroundColor: "#ddd",
    }:{})
}))

const StyledTextarea = styled.textarea(({ $copied }) => ({
    padding: "4px",
    border: "1px solid black",
    margin: "unset",
    overflow: "auto",
    minHeight: "24px",
    maxHeight: "120px",
}))

const StyledPre = styled.pre(({ $copied }) => ({
    padding: "4px",
    border: "1px solid black",
    margin: "unset",
    overflow: "auto",
    minHeight: "24px",
    maxHeight: "120px",
    cursor: $copied ? "default" : "pointer",
    transition: "background-color 500ms ease-in",
    backgroundColor: $copied ? "yellow" : "#eee",
}))

export function TextReplacer() {
    const [mainText, setMainText] = useState("");
    const [texts, setTexts] = useState([""]);
    const [replacements, setReplacements] = useState([["", "-replace-", false]]);


    const replacedTexts = useMemo(() => texts.map(extraText => replacements.reduce((acc, [searchValue, replaceValue, allCaps]) => {
        return searchValue.trim() ? acc.replaceAll(searchValue.trim(), allCaps ? replaceValue.toLocaleUpperCase() : replaceValue) : acc;
    }, extraText), [texts, replacements]));

    return <StyledReplacerContainer>
        <StyledSimpleContainer>
            <StyledReplacementsTable>
                <StyledReplacementsRow>
                    <StyledLabel>Search term</StyledLabel>
                    <StyledLabel>Replacement</StyledLabel>
                    <StyledLabel style={{ "whiteSpace": "nowrap" }}>All caps?</StyledLabel>
                    <button type="button" onClick={() => setReplacements(prev => [...prev, ["", "-replace-", false]])}>Add</button>
                </StyledReplacementsRow>
                {replacements.map(([searchValue, replaceValue, allCaps], index) => <StyledReplacementsRow key={index}>
                    <input type="text" name={`${index}_search`} value={searchValue} onChange={(e) => setReplacements(prev => [...prev.slice(0, index), [e.target.value, prev[index][1], prev[index][2]], ...prev.slice(index + 1)])} />
                    <input type="text" name={`${index}_value`} value={replaceValue} onChange={(e) => setReplacements(prev => [...prev.slice(0, index), [prev[index][0], e.target.value, prev[index][2]], ...prev.slice(index + 1)])} />
                    <input type="checkbox" name={`${index}_all_caps`} checked={allCaps} onChange={(e) => setReplacements(prev => [...prev.slice(0, index), [prev[index][0], prev[index][1], e.target.checked], ...prev.slice(index + 1)])} />

                    {replacements.length > 1 && <button type="button" onClick={() => setReplacements(prev => [...prev.slice(0, index), ...prev.slice(index + 1)])}>X</button>}
                </StyledReplacementsRow>)}
            </StyledReplacementsTable>
        </StyledSimpleContainer>
        <StyledTextsTable>
            <StyledTextsRow>
                <StyledSimpleContainer $direction="row">
                    <StyledLabel>Texts to replace</StyledLabel>
                    <button type="button" onClick={() => setTexts(prev => [...prev, ""])}>+</button>
                </StyledSimpleContainer>
            </StyledTextsRow>
            {texts.map((text, index) => <StyledTextsRow key={index} $odd={Boolean(index % 2)}>
                <StyledTextarea value={text} onChange={e => setTexts(prev => [...prev.slice(0, index), e.target.value, ...prev.slice(index + 1)])} />
                {texts.length > 1 ? <button style={{ flex: "0 0 auto" }} type="button" onClick={() => setTexts(prev => [...prev.slice(0, index), ...prev.slice(index + 1)])}>X</button> : <span />}
                <ReplacedTextVisualizer text={replacedTexts[index]} />
            </StyledTextsRow>)}
        </StyledTextsTable>
    </StyledReplacerContainer>
}

const ReplacedTextVisualizer = ({ text }) => {
    const [copying, setCopying] = useState(null);
    useTimer(copying, () => setCopying(null), 500);

    return <StyledPre $copied={copying} onDoubleClick={() => {
        if (copying) {
            return;
        }
        navigator.clipboard.writeText(text);
        setCopying(true);
    }}>
        {text}
    </StyledPre>
}