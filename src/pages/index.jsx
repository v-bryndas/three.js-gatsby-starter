import React, { useEffect } from "react"

import Layout from "components/layout"
import SEO from "components/seo"
import App from "webgl/App";

import 'main.css'

const IndexPage = () => {

  useEffect(() => {
    window.app = new App();
    window.app.init();
  }, []);
  
  return (
    <Layout>
      <canvas aria-label="Webgl Canvas"/>
      <div className="three-container"></div>
      <SEO title="Home" />
    </Layout>
  )
}

export default IndexPage
