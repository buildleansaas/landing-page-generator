import { stripe as stripeKeys } from "keys";
import { THIS_ENV } from "constants/app";
export const stripe = require("stripe")(stripeKeys[THIS_ENV].secret);
