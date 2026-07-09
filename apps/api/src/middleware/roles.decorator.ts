import { Reflector } from "@nestjs/core";
import { Role } from "@schema/index";

const Roles = Reflector.createDecorator<Role[]>();

export default Roles;
