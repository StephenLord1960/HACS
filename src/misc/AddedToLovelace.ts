import { Repository } from "../types";
import { LovelaceConfig, LovelaceResourceConfig } from "./LovelaceTypes";

export function AddedToLovelace(repository: Repository, lovelaceconfig: LovelaceConfig): boolean {
    if (lovelaceconfig !== undefined) {
        var loaded: boolean = false;
        var URL: string = `/community_plugin/${repository.full_name.split("/")[1]}/${repository.file_name}`;

        if (lovelaceconfig.resources !== undefined) {
            lovelaceconfig.resources.forEach((item: LovelaceResourceConfig) => {
                if (!loaded) {
                    if (item.url === URL) loaded = true;
                };
            })
        }
        return loaded;
    } else return true;
}