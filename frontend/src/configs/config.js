const config = {
  BASE_URL_AUTO: process.env.REACT_APP_APIGW_BASE_URL
  ? process.env.REACT_APP_APIGW_BASE_URL
    :"https://datadaan-backend.azurewebsites.net"
}

export default config;