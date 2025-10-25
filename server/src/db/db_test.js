import sequelize from "./db.js";

async function testconnection() {
  try {
    await sequelize.authenticate();
    console.log("Connection success");
  } catch (error) {
    console.error(error);
  } finally {
    await sequelize.close();
  }
}

testconnection();
