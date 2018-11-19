const cambio = require("../src/index");

/**
 * TRM actual
 * Async / await
 */
async function example() {
  try {
    const data = await cambio();
    const { status, trm } = data;
    if (status === 200) {
      console.log(
        `La TRM vigente en este momento es ${trm.value} (válida de ${
          trm.validityFrom
        } a ${trm.validityTo})`
      );
    }
  } catch (err) {
    console.log(err);
  }
}
example();
