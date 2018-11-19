module.exports = date =>
  new Promise((resolve, reject) => {
    process.nextTick(() => {
      switch (date) {
        case "2018-01-06":
          resolve({
            status: 200,
            trm: `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
            <soap:Body>
                <ns2:queryTCRMResponse xmlns:ns2="http://action.trm.services.generic.action.superfinanciera.nexura.sc.com.co/">
                    <return>
                        <id>620351</id>
                        <unit>COP</unit>
                        <validityFrom>2018-01-06T00:00:00-05:00</validityFrom>
                        <validityTo>2018-01-09T00:00:00-05:00</validityTo>
                        <value>2898.32</value>
                        <success>true</success>
                        <mocked>true</mocked>
                    </return>
                </ns2:queryTCRMResponse>
            </soap:Body>
        </soap:Envelope>`.replace(/\n| {2,}/g, "")
          });
          break;
        case "2018-01-06:false":
          resolve({
            status: 200,
            trm: `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
            <soap:Body>
                <ns2:queryTCRMResponse xmlns:ns2="http://action.trm.services.generic.action.superfinanciera.nexura.sc.com.co/">
                    <return>
                        <id>620351</id>
                        <unit>COP</unit>
                        <validityFrom>2018-01-06T00:00:00-05:00</validityFrom>
                        <validityTo>2018-01-09T00:00:00-05:00</validityTo>
                        <value>2898.32</value>
                        <success>false</success>
                        <mocked>true</mocked>
                    </return>
                </ns2:queryTCRMResponse>
            </soap:Body>
        </soap:Envelope>`.replace(/\n| {2,}/g, "")
          });
          break;
        case "31-10-2018":
          resolve({
            status: 500,
            trm: `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
            <soap:Body>
                <soap:Fault>
                    <faultcode>soap:Client</faultcode>
                    <faultstring>Unmarshalling Error: 31-10-2018 </faultstring>
                    <mocked>true</mocked>
                </soap:Fault>
            </soap:Body>
        </soap:Envelope>`.replace(/\n| {2,}/g, "")
          });
          break;
        case "Unkown error":
          resolve({
            status: 500,
            trm: "Unkown error"
          });
          break;
        default:
          reject(new Error("Unkown request"));
      }
    });
  });
