import { transformAsync } from "@babel/core";
import { NodePath } from "@babel/traverse";
import { ImportDeclaration, Node } from "@babel/types";
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

  log.append(`addImport-code\n\n${code}`);
  log.append(`addImport-componentName\n\n${componentName}`);

  const output = await transformAsync(code, {
    filename: "test.ts",
    configFile: false,
    compact: false,

    retainLines: true,
    plugins: [
      "@babel/plugin-syntax-flow",
      function AddGestaltComponentImportPlugin() {
        return {
          visitor: {
            ImportDeclaration(path: NodePath<ImportDeclaration>) {
              if (path.node.source.value !== "gestalt") {
                return;
              }
              foundGestaltImport = true;
              log.append(`foundGestaltImport: ${foundGestaltImport}`);

              const hasComponentImport = path.node.specifiers.find(
                (node) =>
                  t.isImportSpecifier(node) &&
                  t.isIdentifier(node.imported) &&
                  node.imported.name === componentName
              );
              log.append(`hasComponentImport: ${hasComponentImport}`);

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

  log.append(
    `addImport End-code\n${code}\nfoundGestaltImport: ${foundGestaltImport}  ---- ${
      output?.code ?? ""
    }`
  );

  if (!foundGestaltImport) {
    return `${code}
import { ${componentName} } from 'gestalt';`.trim();
  } else {
    return output?.code ?? "";
  }
}
