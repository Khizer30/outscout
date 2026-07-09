import { createId } from "@paralleldrive/cuid2";
import { text } from "drizzle-orm/pg-core";

const cuid = () => text().$defaultFn(() => createId());

export default cuid;
