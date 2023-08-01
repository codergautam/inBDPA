// pages/_document.js
// Forces all the components to use the dark theme by default.

import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html lang="en-us" className="dark">
            <Head />
            <body >
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}