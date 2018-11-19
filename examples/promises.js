const cambio = require("../src/index");

/**
 * TRM histórica
 * Promesas
 */
const date = "2018-01-06";
cambio(date)
  .then(data => {
    const { status, trm } = data;
    if (status === 200) {
      console.log(
        `La TRM para el ${date} fue ${trm.value} (válida de ${
          trm.validityFrom
        } a ${trm.validityTo})`
      );
    }
  })
  .catch(err => console.log(err));
