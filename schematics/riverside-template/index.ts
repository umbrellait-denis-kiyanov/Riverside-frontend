import { chain, mergeWith } from "@angular-devkit/schematics";
import {
  apply,
  move,
  Rule,
  template,
  url,
  branchAndMerge,
  Tree,
  SchematicContext
} from "@angular-devkit/schematics";
import { strings } from "@angular-devkit/core";
import { findModuleFromOptions } from "@schematics/angular/utility/find-module";
import { getWorkspace } from "@schematics/angular/utility/config";
import { parseName } from "@schematics/angular/utility/parse-name";

import { TemplateOptions } from "./schema";
import { addElements } from "../utils/ng-module-utils";
import { validateProjectName } from "@schematics/angular/utility/validation";

const TEMPLATES_PATH =
  "/src/app/module-viewer/riverside-step-template/templates/";

export default function(options: TemplateOptions): Rule {
  validateProjectName(options.name);

  return (host: Tree, context: SchematicContext) => {
    const workspace = getWorkspace(host);
    if (!options.project) {
      options.project = Object.keys(workspace.projects)[0];
    }

    options.path = TEMPLATES_PATH;

    options.module = findModuleFromOptions(host, options);

    const parsedPath = parseName(options.path, options.name);
    options.name = parsedPath.name;
    options.path = parsedPath.path;

    const templateSource = apply(url("./files"), [
      template({
        ...strings,
        ...options,
        capitalizeAll
      }),
      move(parsedPath.path)
    ]);

    const rule = chain([
      branchAndMerge(chain([mergeWith(templateSource), addElements(options)]))
    ]);

    return rule(host, context);
  };
}

export function capitalizeAll(name: string) {
  return name
    .split("-")
    .map(world => world.charAt(0).toUpperCase() + world.substr(1))
    .join(" ");
}
