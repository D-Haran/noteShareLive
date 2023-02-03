import Document, { Html, Head, Main, NextScript } from 'next/document'
class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@200&display=swap" rel="stylesheet" />
        <Head />
        <body>
          <Main />
          <div id='modal-portal' />
          <NextScript />
        </body>
      </Html>
    )
  }
}
export default MyDocument