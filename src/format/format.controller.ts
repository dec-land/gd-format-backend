import formatService from "./format.service.ts";

export class FormatController {
  public formatGDScript(body: string) {
    return formatService.formatGDScript(body);
  }
}
