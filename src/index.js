const request = require("./request");

/**
 * Convierte cadenas de texto que representan números o valores booleanos en números o booleanos nativos de JavaScript.
 * @param {string} value Texto que se desea convertir a un tipo de datos nativo de JavaScript
 * @returns {any} Un número, booleano o la cadena de texto original
 */
function nativeType(value) {
  const nValue = Number(value);
  if (!Number.isNaN(nValue)) {
    return nValue;
  }
  const bValue = value.toLowerCase();
  if (bValue === "true") {
    return true;
  }
  if (bValue === "false") {
    return false;
  }
  return value;
}

/**
 * Convierte una respuesta válida del servicio web de la SFC en un objeto JSON eliminando los datos innecesarios.
 * @param {string} trmXml La respuesta de la solicitud al servicio web de la SFC
 * @param {string} mode El tipo de respuesta que se desea obtener
 * @returns {object} Los elementos estrictamente necesarios del xml
 */
function parseTRM(trmXml, mode) {
  const trmRegEx = /<([^/][^>]*)>([^<]*)/g;
  const trmJson = {};
  let match = trmRegEx.exec(trmXml);
  if (!match) throw new Error("Unexpected string in parseTRM");
  while (match) {
    if (match[2]) {
      if (mode === "slim") {
        if (
          match[1] === "validityFrom" ||
          match[1] === "validityTo" ||
          match[1] === "value" ||
          match[1] === "message"
        )
          trmJson[match[1]] = nativeType(match[2]);
      } else {
        trmJson[match[1]] = nativeType(match[2]);
      }
    }
    match = trmRegEx.exec(trmXml);
  }
  return trmJson;
}

/**
 * Consulta la Tasa Representativa del Mercado en el servicio web de la Superintendencia Financiera de Colombia para un día dado.
 * @param {string} date La fecha para la cual se desea consultar la TRM
 * @param {object} options Las opciones que se desean para la respuesta
 * @returns {Promise} El código de respuesta del servicio web de la Superintendencia Financiera de Colombia y la información obtenida.
 */
module.exports = async function cambio(
  date,
  { mode = "slim", status = true } = {}
) {
  const { status: statusCode, trm } = await request(date);
  if (status) {
    return {
      status: statusCode,
      trm:
        mode === "raw"
          ? trm
          : parseTRM(trm, statusCode !== 200 && mode === "slim" ? "full" : mode)
    };
  }
  return mode === "raw"
    ? trm
    : parseTRM(trm, statusCode !== 200 && mode === "slim" ? "full" : mode);
};
