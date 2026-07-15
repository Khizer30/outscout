import { Reflector } from "@nestjs/core";

const SuperAdmin = Reflector.createDecorator<boolean>();

export default SuperAdmin;
