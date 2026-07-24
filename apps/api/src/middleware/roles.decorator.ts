import { Reflector } from "@nestjs/core";
import { CompanyMembershipRole } from "@schema/index";

const Roles = Reflector.createDecorator<CompanyMembershipRole[]>();

export default Roles;
