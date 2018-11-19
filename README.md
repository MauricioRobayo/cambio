# Cambio 💵

[![npm version](https://badge.fury.io/js/cambio.svg)](https://badge.fury.io/js/cambio)
[![install size](https://packagephobia.now.sh/badge?p=cambio)](https://packagephobia.now.sh/result?p=cambio)
[![Build Status](https://travis-ci.com/archemiro/cambio.svg?branch=master)](https://travis-ci.com/archemiro/cambio)
[![codecov](https://codecov.io/gh/archemiro/cambio/branch/master/graph/badge.svg)](https://codecov.io/gh/archemiro/cambio)
[![Greenkeeper badge](https://badges.greenkeeper.io/archemiro/cambio.svg)](https://greenkeeper.io/)

Consulta la Tasa Representativa del Mercado en el servicio web de la Superintendencia Financiera de Colombia ![Bandera de Colombia](https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Colombia.svg/22px-Flag_of_Colombia.svg.png).

## Instalación

```shell
npm install cambio
```

## Uso

Requerir la función `cambio`:

```js
const cambio = require("cambio");
```

La función `cambio` recibe los argumentos `date` y `options`, y devuelve una promesa.

### Argumentos

| Argumento   | Descripción                                                                                                                             |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `[date]`    | String - fecha que se desea consultar en formato `YYYY-MM-DD`. Si se omite, se devolverá la información de la TRM para la fecha actual. |
| `[options]` | Objeto - opciones que se desean para la respuesta.                                                                                      |

#### Opciones

| Opción | Descripción                                                                                                                                                                                                        |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| mode   | String - El tipo de respuesta que se desea. Puede ser `slim` mostrando una respuesta resumida; `full` mostrando la respuesta completa; `raw` mostrando el xml original. Por defecto el valor que se usa es `slim`. |
| status | Boolean - Si se muestra o no el código del estado de la respuesta. Por defecto es `true`.                                                                                                                          |

### Respuesta

En caso de que el código del estado de la respuesta del servicio web de la SFC sea `200 OK` y se usen las opciones por defecto, se devuelve una promesa que resuelve con un objecto como el siguiente:

```js
{
  status: 200,
  trm: {
    validityFrom: "2013-01-01T00:00:00-05:00",
    validityTo: "2013-01-02T00:00:00-05:00",
    value: 1768.23,
    message: "No se ha encontrado el valor para la TCRM en la fecha dada: Fri Oct 10 00:00:00 COT 2008. Se retorna el valor de la fecha superior mas cercana",
  }
}
```

El campo `message` no está disponible en todas las respuestas y sólo se mostrará en aquellas en donde sea proporcionado por el servicio web de la SFC.

Si se usa la opcion `mode: full` se obtienen todos los campos de la respuesta:

```js
{
  status: 200,
  trm: {
    id: 1701,
    unit: "COP",
    validityFrom: "2013-01-01T00:00:00-05:00",
    validityTo: "2013-01-02T00:00:00-05:00",
    value: 1768.23,
    message: "No se ha encontrado el valor para la TCRM en la fecha dada: Fri Oct 10 00:00:00 COT 2008. Se retorna el valor de la fecha superior mas cercana",
    success: true
  }
}
```

Si se usa la opcion `mode: raw` se obtiene el `xml` original de la respuesta:

```js
{
  status: 200,
  trm: '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><ns2:queryTCRMResponse xmlns:ns2="http://action.trm.services.generic.action.superfinanciera.nexura.sc.com.co/"><return><id>1701</id><unit>COP</unit><validityFrom>2013-01-01T00:00:00-05:00</validityFrom><validityTo>2013-01-02T00:00:00-05:00</validityTo><value>1768.23</value><message>No se ha encontrado el valor para la TCRM en la fecha dada: Tue Jan 01 00:00:00 COT 2008. Se retorna el valor de la fecha superior mas cercana</message><success>true</success></return></ns2:queryTCRMResponse></soap:Body></soap:Envelope>'
}
```

En caso de que se encuentre otro código de respuesta por parte del servicio web la respuesta será como la siguiente:

```js
{
  status: 500,
  trm: {
    faultcode: "soap:Client",
    faultstring: "Unmarshalling Error: "
  }
}
```

En este caso, `mode: slim` y `mode: full` devolverán la misma información.

## Ejemplos

Para obtener la información de la TRM para el 6 de enero de 2018:

```js
cambio("2018-01-06")
  .then(data => console.log(data))
  .catch(err => console.log(err));
```

```js
{
  status: 200,
  trm: {
    validityFrom: "2018-01-06T00:00:00-05:00",
    validityTo: "2018-01-09T00:00:00-05:00",
    value: 2898.32
  }
}
```

Si sólo se desea obtener la información de la TRM sin el código del estado de la respuesta:

```js
cambio("2018-01-06", { status: false })
  .then(data => console.log(data))
  .catch(err => console.log(err));
```

```js
{
  validityFrom: "2018-01-06T00:00:00-05:00",
  validityTo: "2018-01-09T00:00:00-05:00",
  value: 2898.32
}
```

Si sólo se desea obtener el `xml` devuelto por el servicio web se pueden combinar las opciones `status: false` y `mode: raw`:

```js
cambio("2018-01-06", { mode: "raw", status: false })
  .then(data => console.log(data))
  .catch(err => console.log(err))
);
```

```xml
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><ns2:queryTCRMResponse xmlns:ns2="http://action.trm.services.generic.action.superfinanciera.nexura.sc.com.co/"><return><id>620351</id><unit>COP</unit><validityFrom>2018-01-06T00:00:00-05:00</validityFrom><validityTo>2018-01-09T00:00:00-05:00</validityTo><value>2898.32</value><success>true</success></return></ns2:queryTCRMResponse></soap:Body></soap:Envelope>
```

Para obtener la información de la TRM que aplica para la fecha actual:

```js
cambio()
  .then(data => console.log(data))
  .catch(err => console.log(err));
```

```js
{
  status: 200,
  trm: {
    validityFrom: "2018-11-16T00:00:00-05:00",
    validityTo: "2018-11-16T00:00:00-05:00",
    value: 3198.29
  }
}
```

El argumento `fecha` de la función no es verificado sino que es pasado directamente como argumento en la solicitud SOAP que se hace al servicio web de la SFC, esto quiere decir que se puede pasar un argumento inválido y la función devolverá la respuesta del servicio web a dicho argumento:

```js
cambio("31-10-2018")
  .then(data => console.log(data))
  .catch(err => console.log(err));
```

```js
{
  status: 500,
  trm: {
    faultcode: "soap:Client",
    faultstring: "Unmarshalling Error: 31-10-2018"
  }
}
```

Así mismo, se puede pasar una fecha mayor a la actual en cuyo caso se devolverá la información de la trm para la fecha más reciente disponible:

```js
cambio("9999-10-10")
  .then(data => console.log(data))
  .catch(err => console.log(err));
```

```js
{
  status: 200,
  trm: {
    validityFrom: "2018-11-16T00:00:00-05:00",
    validityTo: "2018-11-16T00:00:00-05:00",
    value: 3198.29
  }
}
```

El servicio web de la SFC proporciona información de la TRM a partir de `2013-01-01`, por lo que si se solicita una fecha menor a esta fecha se devolverá el valor correspondiente a dicha fecha:

```js
cambio("1978-10-10")
  .then(data => console.log(data))
  .catch(err => console.log(err));
```

```js
{
  status: 200,
  trm: {
    validityFrom: "2013-01-01T00:00:00-05:00",
    validityTo: "2013-01-02T00:00:00-05:00",
    value: 1768.23,
    message: "No se ha encontrado el valor para la TCRM en la fecha dada: Tue Oct 10 00:00:00 COT 1978. Se retorna el valor de la fecha superior mas cercana"
  }
}
```

## Licencia

[MIT](LICENSE)
