/* @flow */

import recast from 'recast';
import { utils } from 'react-docgen';
const { isExportsOrModuleAssignment, getNameOrValue } = utils;

const {types: {namedTypes: types}} = recast;

type exportsT = {
  format: 'ES2015' | 'CommonJS',
  type: 'default' | 'named',
  name: string,
};


function isExported(path: NodePath): boolean {
  return types.ExportDefaultDeclaration.check(path.node) ||
    types.ExportNamedDeclaration.check(path.node) ||
    isExportsOrModuleAssignment(path);
}

function findIdentifier(path: NodePath): ?string {
  if (!path || !path.node) {
    return null;
  }
  return path.node.id ? path.node.id.name : findIdentifier(path.parentPath);
}

function getExportType(path: NodePath, name: string): ?exportsT {
  if (types.ExportDefaultDeclaration.check(path.node)) {
    return { format: 'ES2015', type: 'default', name};
  } else if (types.ExportNamedDeclaration.check(path.node)) {
    return { format: 'ES2015', type: 'named', name};
  } else if (types.AssignmentExpression.check(path.node)) {
    const _path = path.get('left');
    if (types.MemberExpression.check(_path.node)) {
      const isComputed: boolean = _path.node.computed;

      if (!isComputed || types.Literal.check(_path.node.property)) {
        const _name: string = getNameOrValue(_path.get('property'));

        if (_name !== 'exports') {
          return { format: 'CommonJS', type: 'named', name: _name};
        } else {
          return { format: 'CommonJS', type: 'default', name};
        }
      } else {
        throw new Error('Cannot resolve computed property name');
      }
    } else {
      return { format: 'CommonJS', type: 'default', name};
    }
  }
}


export default function exportsHandler(
  documentation: Documentation,
  definition: NodePath
): void {
  const name = findIdentifier(definition) || '';
  let exports: ?exportsT = null;
  let path = definition;

  while (path && !isExported(path)) {
      path = path.parentPath;
  }

  if (path) {
    exports = getExportType(path, name);
    if (exports) {
      documentation.set('exports', exports);
      return;
    }
  }

  if (name) {
    const scope = definition.scope.lookup(name);

    if (scope) {
      recast.visit(scope.node, {
        visitExportDefaultDeclaration: (path) => {
          if (types.Identifier.check(path.node.declaration)) {
            if (path.node.declaration.name === name) {
              exports = getExportType(path, name);
            }
          }
          return false;
        },
        visitExportNamedDeclaration: (path) => {
          path.node.specifiers.forEach(specifier => {
            if (specifier.local.name === name) {
              exports = getExportType(path, specifier.exported.name);
            }
          });
          return false;
        },
        visitAssignmentExpression: (path) => {
          if (isExportsOrModuleAssignment(path)) {
            if (types.Identifier.check(path.node.right)) {
              if (path.node.right.name === name) {
                exports = getExportType(path, name);
              }
            }
          }
          return false;
        },
      });
    }
  }

  if (exports) {
    documentation.set('exports', exports);
  }
}
