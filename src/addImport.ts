import { transformAsync } from "@babel/core";
import { NodePath } from "@babel/traverse";
import { ImportDeclaration, Node } from "@babel/types";
import babelPluginSyntaxFlow from "./babelPluginSyntaxFlow";
import * as t from "@babel/types";
import log from "./log";

export default async function addImport({
  code,
  componentName,
}: {
  code: string;
  componentName: string;
}): Promise<string> {
  let foundGestaltImport = false;
  let output;

  try {
    output = await transformAsync(code, {
      filename: "test.ts",
      configFile: false,
      compact: false,

      retainLines: true,
      plugins: [
        babelPluginSyntaxFlow,
        function AddGestaltComponentImportPlugin() {
          return {
            visitor: {
              ImportDeclaration(path: NodePath<ImportDeclaration>) {
                if (path.node.source.value !== "gestalt") {
                  return;
                }
                foundGestaltImport = true;

                const hasComponentImport = path.node.specifiers.find(
                  (node) =>
                    t.isImportSpecifier(node) &&
                    t.isIdentifier(node.imported) &&
                    node.imported.name === componentName
                );

                if (!hasComponentImport) {
                  const newSpecifier = t.importSpecifier(
                    t.identifier(componentName),
                    t.identifier(componentName)
                  );
                  path.node.specifiers.push(newSpecifier);
                  path.node.specifiers = path.node.specifiers.sort(
                    (specifierA, specifierB) => {
                      if (
                        !t.isImportSpecifier(specifierA) ||
                        !t.isImportSpecifier(specifierB) ||
                        !t.isIdentifier(specifierA.imported) ||
                        !t.isIdentifier(specifierB.imported)
                      ) {
                        return 0;
                      }
                      if (specifierA.imported.name > specifierB.imported.name) {
                        return 1;
                      }
                      if (specifierA.imported.name < specifierB.imported.name) {
                        return -1;
                      }
                      return 0;
                    }
                  );
                }
              },
            },
          };
        },
      ],
    });
  } catch (error) {
    log.append(`addImport Error - ${error.message} - ${error}`);
  }

  if (!foundGestaltImport) {
    return `${code}
import { ${componentName} } from 'gestalt';`.trim();
  } else {
    return output?.code ?? "";
  }
}
