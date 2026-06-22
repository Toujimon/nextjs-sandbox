'use client'

import React, { useEffect, useMemo, useState, useRef } from "react";
import styled from "styled-components";
import { useRouter, usePathname } from "next/navigation";

const StyledAppBar = styled.header(props => ({
  position: "sticky",
  top: 0,
  right: 0,
  color: "#fff",
  backgroundColor: "#3f51b5",
  display: "flex",
  alignItems: "center",
  zIndex: 1100,
  width: "100%",
  boxShadow:
    "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
  transition: "transform 200ms linear",
  ...(props.$hidden ? { transform: "translateY(-100%)" } : {})
}));

const StyledAppBarTabs = styled.div({
  flex: "0 0 auto",
  marginLeft: "auto",
  display: "flex",
  minHeight: "48px",
});

const Tab = styled(({ active, ...rest }) => <button  {...rest} />)((props) => ({
  fontSize: "0.875rem",
  textAlign: "center",
  fontFamily: "Roboto, Helvetica, Arial. sans-serif",
  fontWeight: "500",
  lineHeight: "1.75",
  whiteSpace: "normal",
  letterSpacing: "0.02857em",
  textTransform: "uppercase",
  backgroundColor: "transparent",
  color: "#fff",
  border: "2px solid transparent",
  minWidth: "120px",
  "&:hover:not(:disabled)": {
    cursor: "pointer",
  },
  ...(props.active && {
    borderBottomColor: "pink",
  }),
}));

const HOME_SUBPATH = "/";
const tabsValues = [
  [HOME_SUBPATH, "Home"],
  ["/resume", "Resume"],
  ["/lab", "Lab"],
];

function getTabValue(pathname) {
  const [, subPath] = /^(\/\S+)(\/\S*)*$/.exec(pathname) ?? [];
  if (!subPath) {
    return tabsValues[0][0];
  }
  return tabsValues.find(([x]) => x === subPath)?.[0] ?? false;
}

export default function MainLayout({
  children,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const tabValue = useMemo(
    () => getTabValue(pathname),
    [pathname]
  );

  const headerRef = useRef(null);
  const [isAppBarHidden, setIsAppBarHidden] = useState(false);
  const [googleCredentials, setGoogleCredential] = useState(null);

  useEffect(() => {
    let scrollInit = -1;
    let scrollEnd = -1;

    const scrollHandler = () => {
      if (scrollInit < 0) {
        scrollEnd = scrollInit = window.scrollY;
        setTimeout(() => {
          if (scrollEnd < headerRef.current.scrollHeight || scrollEnd < scrollInit) {
            setIsAppBarHidden(false);
          }
          else if (scrollEnd > headerRef.current.scrollHeight * 5) {
            setIsAppBarHidden(true);
          }
          scrollInit = -1;
          scrollEnd = -1;
        }, 500);
      }
      else {
        scrollEnd = window.scrollY;
      }
    };

    document.addEventListener("scroll", scrollHandler);

    return () => {
      document.removeEventListener("scroll", scrollHandler);
    }
  }, [])

  useEffect(() => {
    if (!googleCredentials) {
      let storedGoogleCredentials = null;
      try {
        storedGoogleCredentials = JSON.parse(localStorage.getItem("google-credentials")) ?? null;
      }
      catch (error) {
        console.error("Failure restoring credentials", error);
        localStorage.removeItem("google-credentials");
      }
      if (!storedGoogleCredentials && !document.getElementById("google-credentials-element")) {
        console.log("debug::storedCredentials", storedGoogleCredentials);
        window["google_credentials_getter"] = (args) => {
          console.log("debug::Obtained credentials. Storing into local storage", args);
          localStorage.setItem("google-credentials",JSON.stringify(args));
          setGoogleCredential(args);
        }
        const googleCredentialsElement = document.createElement("div");
        googleCredentialsElement.setAttribute("id", "google-credentials-element");
        googleCredentialsElement.innerHTML =
          `<div id="g_id_onload"
     data-client_id="595833665256-ib6jcs1irspqv98f16m4uaqrij7uhsc4.apps.googleusercontent.com"
     data-context="signin"
     data-callback="google_credentials_getter"
     data-nonce=""
     data-auto_select="true"
     data-itp_support="true">
</div>`;
        document.body.appendChild(googleCredentialsElement);
        const gsiClientScriptElement = document.createElement("script");
        gsiClientScriptElement.setAttribute("src", "https://accounts.google.com/gsi/client");
        document.head.appendChild(gsiClientScriptElement);
      } else if (storedGoogleCredentials) {
        console.log("debug::storedCredentials", storedGoogleCredentials);
        setGoogleCredential(storedGoogleCredentials);
      }
      return;
    }

    if (document.getElementById("google-credentials-element")) {
      document.body.removeChild(document.getElementById("google-credentials-element"));
      delete window["google_credentials_getter"];
    }

  }, [googleCredentials]);

  return (
    <>
      <StyledAppBar ref={headerRef} $hidden={isAppBarHidden}>
        <StyledAppBarTabs>
          {tabsValues.map(([value, label]) => (
            <Tab
              key={value}
              type="button"
              disabled={value === tabValue}
              active={value === tabValue}
              onClick={() => router.push(value)}
            >
              {label}
            </Tab>
          ))}
        </StyledAppBarTabs>
      </StyledAppBar>
      {children}
    </>
  );
}
