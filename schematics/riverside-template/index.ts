import { chain, mergeWith } from '@angular-devkit/schematics';
import { TemplateOptions } from './schema';
import { apply, move, Rule, template, url, branchAndMerge, Tree, SchematicContext } from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { addDeclarationToNgModule } from '../utils/ng-module-utils';
import { findModuleFromOptions } from '../schematics-angular-utils/find-module';

import { getWorkspace } from '../schematics-angular-utils/config';
import { parseName } from '../utils/parse-name';

export default function(options: TemplateOptions): Rule {

    return (host: Tree, context: SchematicContext) => {

      const workspace = getWorkspace(host);
      if (!options.project) {
        options.project = Object.keys(workspace.projects)[0];
      }

      options.path = '/src/app/module-viewer/riverside-step-template/templates/';

      options.module = findModuleFromOptions(host, options);

      const parsedPath = parseName(options.path, options.name);
      options.name = parsedPath.name;
      options.path = parsedPath.path;

      const templateSource = apply(url('./files'), [
        template({
          ...strings,
          ...options,
        }),
        move(parsedPath.path)
      ]);

      const rule = chain([
        branchAndMerge(chain([
          mergeWith(templateSource),
          addDeclarationToNgModule(options),
        ]))
      ]);

      return rule(host, context);
    };
}
