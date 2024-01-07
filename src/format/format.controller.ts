import formatService from "./format.service";

export class FormatController {
  public formatGDScript(body: string, max_line_length: number) {
    return formatService.formatGDScript(body);
  }
}
