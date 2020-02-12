import { Rule, Tree, SchematicsException } from '@angular-devkit/schematics';
import { AddToModuleContext } from './add-to-module-context';
import * as ts from 'typescript';
import { strings } from '@angular-devkit/core';
import { ModuleOptions, buildRelativePath } from '../schematics-angular-utils/find-module';
import { addDeclarationToModule, addEntryToModule } from '../schematics-angular-utils/ast-utils';
import { InsertChange } from '../schematics-angular-utils/change';

const { dasherize, classify } = strings;

const stringUtils = { dasherize, classify };

export function addDeclarationToNgModule(options: ModuleOptions): Rule {
  return (host: Tree) => {
    addDeclaration(host, options);
    addEntry(host, options);
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

  const componentPath = `${options.path}/`
      + stringUtils.dasherize(options.name) + '/'
      + stringUtils.dasherize(options.name)
      + '.component';

  result.relativePath = buildRelativePath(options.module, componentPath);

  result.classifiedName = stringUtils.classify(`${options.name}Component`);

  return result;

}

function createAddToIndexContext(host: Tree, options: ModuleOptions): AddToModuleContext {

  const result = new AddToModuleContext();
  const path = options.path + '/index.ts';

  const text = host.read(path);

  if (text === null) {
    throw new SchematicsException(`File ${path} does not exist!`);
  }

  const sourceText = text.toString('utf-8');

  result.source = ts.createSourceFile(path, sourceText, ts.ScriptTarget.Latest, true);

  const componentPath = `${options.path}/`
      + stringUtils.dasherize(options.name) + '/'
      + stringUtils.dasherize(options.name)
      + '.component';

  result.relativePath = buildRelativePath(path, componentPath);

  result.classifiedName = stringUtils.classify(`${options.name}Component`);

  return result;
}

function addDeclaration(host: Tree, options: ModuleOptions) {

  const context = createAddToModuleContext(host, options);
  const modulePath = options.module || '';

  const declarationChanges = addDeclarationToModule(context.source,
    modulePath,
      context.classifiedName,
      context.relativePath);

  const declarationRecorder = host.beginUpdate(modulePath);
  for (const change of declarationChanges) {
    if (change instanceof InsertChange) {
      declarationRecorder.insertLeft(change.pos, change.toAdd);
    }
  }
  host.commitUpdate(declarationRecorder);
}

function addEntry(host: Tree, options: ModuleOptions) {

  const context = createAddToModuleContext(host, options);
  const modulePath = options.module || '';

  const declarationChanges = addEntryToModule(context.source,
    modulePath,
    context.classifiedName,
    context.relativePath);

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
  // @ts-ignore
  const properties: ts.Node[] = statement.declarationList.declarations[0].initializer.properties;
  const declarationChanges = [
    new InsertChange(
      options.path + '/index.ts',
      properties[properties.length - 1].end,
      ',\n  test: TestComponent'
    )
  ];

  const declarationRecorder = host.beginUpdate(options.path + '/index.ts');
  for (const change of declarationChanges) {
    if (change instanceof InsertChange) {
      declarationRecorder.insertLeft(change.pos, change.toAdd);
    }
  }
  host.commitUpdate(declarationRecorder);
}
