import { format } from 'prettier';

import { getImportNodes } from '../get-import-nodes';
import { getSortedNodes } from '../get-sorted-nodes';
import { getCodeFromAst } from '../get-code-from-ast';

test('it sorts imports correctly', () => {
    const code = `// first comment
// second comment
import z from 'z';
import c from 'c';
import g from 'g';
import t from 't';
import k from 'k';
import a from 'a';
`;
    const importNodes = getImportNodes(code);
    const sortedNodes = getSortedNodes(importNodes, {
        importOrder: [],
        importOrderCaseInsensitive: false,
        importOrderSeparation: false,
        importOrderSortByPrintWidth: false,
        importOrderGroupNamespaceSpecifiers: false,
        importOrderSortSpecifiers: false,
    });
    const formatted = getCodeFromAst(sortedNodes, code, null);
    expect(format(formatted, { parser: 'babel' })).toEqual(
        `// first comment
// second comment
import a from "a";
import c from "c";
import g from "g";
import k from "k";
import t from "t";
import z from "z";
`,
    );
});
