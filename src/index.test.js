const cambio = require('./index')

jest.mock('./request')

it('should return slim trm data for a given date', async () => {
  expect.assertions(2)
  expect(await cambio('2018-01-06')).toEqual({
    status: 200,
    trm: {
      validityFrom: '2018-01-06T00:00:00-05:00',
      validityTo: '2018-01-09T00:00:00-05:00',
      value: 2898.32,
    },
  })
  expect(await cambio('2018-01-06', { mode: 'slim' })).toEqual({
    status: 200,
    trm: {
      validityFrom: '2018-01-06T00:00:00-05:00',
      validityTo: '2018-01-09T00:00:00-05:00',
      value: 2898.32,
    },
  })
})
it('should return all trm data for a given date', async () => {
  expect.assertions(2)
  expect(await cambio('2018-01-06', { mode: 'full' })).toEqual({
    status: 200,
    trm: {
      id: 620351,
      unit: 'COP',
      validityFrom: '2018-01-06T00:00:00-05:00',
      validityTo: '2018-01-09T00:00:00-05:00',
      value: 2898.32,
      success: true,
      mocked: true,
    },
  })
  expect(await cambio('2018-01-06:false', { mode: 'full' })).toEqual({
    status: 200,
    trm: {
      id: 620351,
      unit: 'COP',
      validityFrom: '2018-01-06T00:00:00-05:00',
      validityTo: '2018-01-09T00:00:00-05:00',
      value: 2898.32,
      success: false,
      mocked: true,
    },
  })
})
it('should return data with no status when `status: false`', async () => {
  expect.assertions(1)
  expect(await cambio('2018-01-06', { mode: 'full', status: false })).toEqual({
    id: 620351,
    unit: 'COP',
    validityFrom: '2018-01-06T00:00:00-05:00',
    validityTo: '2018-01-09T00:00:00-05:00',
    value: 2898.32,
    success: true,
    mocked: true,
  })
})
it('should return xml data for option `mode: raw`', async () => {
  expect.assertions(2)
  expect(await cambio('2018-01-06', { mode: 'raw' })).toEqual({
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
</soap:Envelope>`.replace(/\n| {2,}/g, ''),
  })
  expect(await cambio('2018-01-06', { mode: 'raw', status: false })).toBe(
    `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
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
</soap:Envelope>`.replace(/\n| {2,}/g, ''),
  )
})
it('should return error info for a baddly formated date', async () => {
  expect.assertions(2)
  expect(await cambio('31-10-2018')).toEqual({
    status: 500,
    trm: {
      faultcode: 'soap:Client',
      faultstring: 'Unmarshalling Error: 31-10-2018 ',
      mocked: true,
    },
  })
  expect(await cambio('31-10-2018', { mode: 'slim', status: false })).toEqual({
    faultcode: 'soap:Client',
    faultstring: 'Unmarshalling Error: 31-10-2018 ',
    mocked: true,
  })
})
it('should throw an error with an unexpected response', async () => {
  expect.assertions(1)
  await expect(cambio('Unkown error')).rejects.toThrowError(
    'Unexpected string in parseTRM',
  )
})
