import { useMemo, useState } from "react";
import { usePopper } from "react-popper";
import styled from "styled-components";

const StyledTooltip = styled.div`
  color: #fff;
  border-radius: 4px;
  background-color: #00f;

  & > span:first-of-type {
    display: block;
    height: 8px;
    width: 8px;

    &::before {
      content: "";
      width: 100%;
      height: 100%;
      display: block;
      background-color: #f00;
    }
  }

  & > div {
    padding: 8px;
  }
`;

export function useMyTooltip() {
  const [referenceRef, setReferenceRef] = useState(null);
  const [tooltipRef, setTooltipRef] = useState(null);
  const [tooltipArrowRef, setTooltipArrowRef] = useState(null);
  const { styles, attributes } = usePopper(referenceRef, tooltipRef, {
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 8]
        }
      },
      {
        name: "arrow",
        options: {
          element: tooltipArrowRef
        }
      }
    ]
  });

  return useMemo(() => {
    return {
      referenceRef: setReferenceRef,
      tooltipData: {
        refs: {
          popper: setTooltipRef,
          arrow: setTooltipArrowRef
        },
        styles,
        attributes
      }
    };
  }, [styles, attributes, setReferenceRef, setTooltipRef, setTooltipArrowRef]);
}

export default function MyTooltip({ children, tooltipData, className }) {
  const { refs, styles, attributes } = tooltipData;
  return (
    <StyledTooltip
      ref={refs.popper}
      className={className}
      style={styles.popper}
      {...attributes.popper}
    >
      <span ref={refs.arrow} style={styles.arrow} />
      <div>{children}</div>
    </StyledTooltip>
  );
}
