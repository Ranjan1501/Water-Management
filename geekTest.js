const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const port = process.env.PORT || 5000; 
const app = express();
app.use(express.json());

app.listen(port, () => {
  console.log(`Server Running on  Port ${port}`);
});

let guest = 0;

// Add Guest Route
app.post("/guest", (req, res) => {
  guest += req.body.ADD_GUESTS;
  return res.json({ totalGuest: guest });
});

// Total Bill Generation as per given input
app.get("/", (req, res) => {
  let corWater = +req.body.Corporation_Water;
  let borWater = +req.body.Borewell_Water;
  let consumptionPerPerson;
  if (req.body.apartment_type == 2) {
    consumptionPerPerson = 900;
  } else if (req.body.apartment_type == 3) {
    consumptionPerPerson = 1500;
  }
  let unitCost = consumptionPerPerson / (corWater + borWater);
  let waterConsumedByGuest = guest * 10 * 30;
  let guestBill = 0;

  if (waterConsumedByGuest > 0) {
    guestBill = waterConsumedByGuest * 2;
  }
  if (waterConsumedByGuest > 500) {
    guestBill = 500 * 2 + (waterConsumedByGuest - 500) * 3;
  }
  if (waterConsumedByGuest > 1500) {
    guestBill = 500 * 2 + 1000 * 3 + (waterConsumedByGuest - 1500) * 5;
  }
  if (waterConsumedByGuest > 3000) {
    guestBill =
      500 * 2 + 1000 * 3 + 1500 * 5 + (waterConsumedByGuest - 3000) * 8;
  }
  let totalBill =
    Math.floor(unitCost * corWater * 1 + unitCost * borWater * 1.5) + guestBill;

  console.log(guestBill);

  let totalWater =
    unitCost * corWater + unitCost * borWater + waterConsumedByGuest;
  return res.send(`${totalWater}  ${totalBill}`);
});
