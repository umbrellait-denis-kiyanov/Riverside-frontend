import * as ts from 'typescript';
import { Rule, Tree, SchematicsException } from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { ModuleOptions, buildRelativePath } from '@schematics/angular/utility/find-module';
import { InsertChange } from '@schematics/angular/utility/change';
import { addEntryComponentToModule, addDeclarationToModule, insertImport } from '@schematics/angular/utility/ast-utils';

import { TemplateOptions } from '../riverside-template/schema';
import { AddToModuleContext } from './add-to-module-context';

const { dasherize, classify, underscore } = strings;
const stringUtils = { dasherize, classify, underscore };

let indexPath: string;

export function addElements(options: ModuleOptions): Rule {
  indexPath = `${options.path}/index.ts`;
  return (host: Tree) => {
    addDeclarations(host, options);
    addIndex(host, options);
    return host;
  };
}

function createAddToModuleContext(host: Tree, options: ModuleOptions): AddToModuleContext {

  const result = new AddToModuleContext();

  if (!options.module) {
    throw new SchematicsException(`Module not found.`);
  }

  const text = host.read(options.module);

  if (text === null) {
    throw new SchematicsException(`File ${options.module} does not exist!`);
  }
  const sourceText = text.toString('utf-8');
  result.source = ts.createSourceFile(options.module, sourceText, ts.ScriptTarget.Latest, true);

  result.relativePath = buildRelativePath(options.module, getComponentPath(options));

  result.classifiedName = stringUtils.classify(`${options.name}Component`);

  return result;
}

function createAddToIndexContext(host: Tree, options: ModuleOptions): AddToModuleContext {

  const result = new AddToModuleContext();

  const text = host.read(indexPath);

  if (text === null) {
    throw new SchematicsException(`File ${indexPath} does not exist!`);
  }

  const sourceText = text.toString('utf-8');

  result.source = ts.createSourceFile(indexPath, sourceText, ts.ScriptTarget.Latest, true);

  result.relativePath = buildRelativePath(indexPath, getComponentPath(options));

  result.classifiedName = stringUtils.classify(`${options.name}Component`);

  return result;
}

function addDeclarations(host: Tree, options: ModuleOptions) {

  const context = createAddToModuleContext(host, options);
  const modulePath = options.module || '';

  const declarationChanges =
    addDeclarationToModule(
      context.source,
      modulePath,
      context.classifiedName,
      context.relativePath
    ).concat(
      addEntryComponentToModule(
        context.source,
        modulePath,
        context.classifiedName,
        null as any as string
      )
    );

  const declarationRecorder = host.beginUpdate(modulePath);
  for (const change of declarationChanges) {
    if (change instanceof InsertChange) {
      declarationRecorder.insertLeft(change.pos, change.toAdd);
    }
  }
  host.commitUpdate(declarationRecorder);
}

function addIndex(host: Tree, options: ModuleOptions) {
  const context = createAddToIndexContext(host, options);
  const statement = context.source.statements
    .filter(st => st.kind === ts.SyntaxKind.VariableStatement)[0];

  const underscoreName = stringUtils.underscore(options.name);
  const classifyName = `${stringUtils.classify(options.name)}Component`;

  // @ts-ignore
  const properties: ts.Node[] = statement.declarationList.declarations[0].initializer.properties;
  const declarationChanges = [
    new InsertChange(
      indexPath,
      properties[properties.length - 1].end,
      `,\n  ${underscoreName}: ${classifyName}`
    ),
    insertImport(
      context.source,
      indexPath,
      classifyName,
      buildRelativePath(indexPath, getComponentPath(options))
    )
  ];

  const declarationRecorder = host.beginUpdate(indexPath);
  for (const change of declarationChanges) {
    if (change instanceof InsertChange) {
      declarationRecorder.insertLeft(change.pos, change.toAdd);
    }
  }
  host.commitUpdate(declarationRecorder);
}

function getComponentPath(options: TemplateOptions) {
  return `${options.path}/`
  + stringUtils.dasherize(options.name) + '/'
  + stringUtils.dasherize(options.name)
  + '.component';
}
