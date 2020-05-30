import { EnvironmentI } from "./environment.interface";
import packageJson from '../../package.json';

export const Environment: EnvironmentI = {
    Production: true,
    Version: packageJson.version
}