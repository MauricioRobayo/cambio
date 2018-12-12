const https = require("https");
const { URL } = require("url");

// https://www.superfinanciera.gov.co/descargas?com=institucional&name=pubFile1016117&downloadname=20151228manualserviciowebtrm.pdf
// https://www.youtube.com/watch?v=a-eB6nqwOh0&t=345s
const WSDLUrl =
  "https://www.superfinanciera.gov.co/SuperfinancieraWebServiceTRM/TCRMServicesWebService/TCRMServicesWebService";

const urlObject = new URL(WSDLUrl);

const options = {
  protocol: urlObject.protocol,
  host: urlObject.hostname,
  port: urlObject.port,
  path: urlObject.pathname,
  method: "POST",
  headers: {
    "Content-Type": "text/xml"
  }
};

const requestBody = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:act="http://action.trm.services.generic.action.superfinanciera.nexura.sc.com.co/">
<soapenv:Header/>
<soapenv:Body>
    <act:queryTCRM>
      <!--Optional:-->
    </act:queryTCRM>
</soapenv:Body>
</soapenv:Envelope>`;

module.exports = date =>
  new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let data = "";
      res.on("data", _data => {
        data += _data;
      });
      res.on("end", () => {
        resolve({
          status: res.statusCode,
          trm: data
        });
      });
    });
    req.on("error", error => {
      reject(error);
    });
    req.write(
      date
        ? requestBody.replace(
            "<!--Optional:-->",
            `<tcrmQueryAssociatedDate>${date}</tcrmQueryAssociatedDate>`
          )
        : requestBody
    );
    req.end();
  });
