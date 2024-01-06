import formatService from "./format.service";

export class FormatController {
  public formatGDScript(body: string) {
    return formatService.formatGDScript(body);
  }
}
