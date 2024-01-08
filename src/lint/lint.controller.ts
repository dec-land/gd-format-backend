import lintService from "./lint.service";

export class LintController {
  public lintGDScript(body: string) {
    return lintService.lintGDScript(body);
  }
}
