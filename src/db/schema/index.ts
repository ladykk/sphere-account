import * as auth from "./auth";
import * as customer from "./customer";

const schema = {
  ...auth,
  ...customer,
};
export default schema;
