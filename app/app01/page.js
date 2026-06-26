'use client'

import Head from "next/head";
import { ContentBox, StyledPageContainer } from "../../components/commonStyledElements";
import { useEffect, useEffectEvent } from "react";

/* Somehow the login status should be checked before rendering this content */
export default function App001LoginPage() {
    const onCredentialsResponse = useEffectEvent((args) => {
        console.log("debug::credentials response", args);
    })
    useEffect(() => {
        if (document.getElementById('gis-client-script')) {
            return;
        }

        window.onGoogleLibraryLoad = () => {
            console.log("google library has loaded");
            google.accounts.id.initialize({
                client_id: '595833665256-ib6jcs1irspqv98f16m4uaqrij7uhsc4.apps.googleusercontent.com',
                callback: onCredentialsResponse
            });
            // google.accounts.id.prompt();
            google.accounts.id.renderButton(
                document.getElementById("gis-elements"),
                {}
            )
        }

        const gisClientScript = document.createElement("script");
        gisClientScript.setAttribute("id", "gis-client-script");
        gisClientScript.setAttribute("src", "https://accounts.google.com/gsi/client");
        document.body.appendChild(gisClientScript);
    }, []);
    return <StyledPageContainer>
        <ContentBox id="gis-elements">
        </ContentBox>
    </StyledPageContainer>
};
