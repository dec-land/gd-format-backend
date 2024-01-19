import { GodotVersion } from "../types/Convert";
import convertService from "./convert.service";

export class ConvertController {
  public convertGdScriptToCSharp(body: string, version: GodotVersion) {
    return convertService.convert(body, version, "gdscript-c#");
  }

  public convertCSharpToGdScript(body: string, version: GodotVersion) {
    return convertService.convert(body, version, "c#-gdscript");
  }
}
