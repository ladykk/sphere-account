import * as auth from "./auth";
import * as customer from "./customer";
import * as employee from "./employee";

const schema = {
  ...auth,
  ...customer,
  ...employee,
};
export default schema;
