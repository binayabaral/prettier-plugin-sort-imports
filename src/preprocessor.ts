import traverse, { NodePath } from '@babel/traverse';
import { ParserOptions, parse as babelParser } from '@babel/parser';
import { ImportDeclaration, isTSModuleDeclaration } from '@babel/types';

import { PrettierOptions } from './types';
import { getSortedNodes } from './utils/get-sorted-nodes';
import { getCodeFromAst } from './utils/get-code-from-ast';
import { getExperimentalParserPlugins } from './utils/get-experimental-parser-plugins';

export function preprocessor(code: string, options: PrettierOptions) {
    const {
        importOrderParserPlugins,
        importOrder,
        importOrderCaseInsensitive,
        importOrderSeparation,
        importOrderSortByPrintWidth,
        importOrderGroupNamespaceSpecifiers,
        importOrderSortSpecifiers,
    } = options;

    const importNodes: ImportDeclaration[] = [];
    const parserOptions: ParserOptions = {
        sourceType: 'module',
        plugins: getExperimentalParserPlugins(importOrderParserPlugins),
    };

    const ast = babelParser(code, parserOptions);
    const interpreter = ast.program.interpreter;

    traverse(ast, {
        ImportDeclaration(path: NodePath<ImportDeclaration>) {
            const tsModuleParent = path.findParent((p) =>
                isTSModuleDeclaration(p),
            );
            if (!tsModuleParent) {
                importNodes.push(path.node);
            }
        },
    });

    // short-circuit if there are no import declaration
    if (importNodes.length === 0) return code;

    const allImports = getSortedNodes(importNodes, {
        importOrder,
        importOrderCaseInsensitive,
        importOrderSeparation,
        importOrderSortByPrintWidth,
        importOrderGroupNamespaceSpecifiers,
        importOrderSortSpecifiers,
    });

    return getCodeFromAst(allImports, code, interpreter);
}
