import React from "react"
import PropTypes from "prop-types"

export default function HTML(props) {
  let title = 'GT';
  let description = 'Gatsby and three.js boilerplate.';
  
  return (
    <html {...props.htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />

        <meta property="og:type" content="website"/>
        <meta property="twitter:card" content="summary"/>
        <meta property="twitter:creator" content="https://twitter.com/menberusch"/>
        <meta property="og:title" content={title}/>
        <meta property="twitter:title" content={title}/>
        <meta property="og:description" content={description}/>
        <meta property="twitter:description" content={description}/>

        {props.headComponents}
      </head>
      <body style={{background: '#000'}} {...props.bodyAttributes}>
        {props.preBodyComponents}
        <noscript key="noscript" id="gatsby-noscript">
          This app works best with JavaScript enabled.
        </noscript>
        <div
          key={`body`}
          id="___gatsby"
          dangerouslySetInnerHTML={{ __html: props.body }}
        />
        {props.postBodyComponents}
      </body>
    </html>
  )
}

HTML.propTypes = {
  htmlAttributes: PropTypes.object,
  headComponents: PropTypes.array,
  bodyAttributes: PropTypes.object,
  preBodyComponents: PropTypes.array,
  body: PropTypes.string,
  postBodyComponents: PropTypes.array,
}
