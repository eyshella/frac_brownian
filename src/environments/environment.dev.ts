import { EnvironmentI } from "./environment.interface";
import packageJson from '../../package.json';

export const Environment: EnvironmentI = {
    Production: false,
    Version: packageJson.version
}