const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("ExpenseTrackerModule", (m) => {
  const expenseTracker = m.contract("ExpenseTracker");

  return { expenseTracker };
});
