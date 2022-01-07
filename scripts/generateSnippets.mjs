import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import fs from "fs";
import path from "path";
import { parse as reactDocgenParse } from "react-docgen";
import { command } from "execa";
import prettier from "prettier";

const GESTALT_SRC = "out/gestalt/packages/gestalt/src/";

async function cloneGestalt() {
  await command("rm -rf out/gestalt");
  await command("mkdir -p out/gestalt");
  await command(
    "git clone --depth 1 https://github.com/pinterest/gestalt.git out/gestalt"
  );
}

async function gestaltImports() {
  const GESTALT_EXPORTS = await fs.promises.readFile(
    path.join(GESTALT_SRC, "index.js"),
    "utf-8"
  );

  const ast = parse(GESTALT_EXPORTS, {
    sourceType: "module",

    plugins: ["jsx", "flow"],
  });

  const imports = [];

  traverse.default(ast, {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ImportDeclaration: function (nodePath) {
      nodePath.node.specifiers.forEach((specifier) => {
        imports.push({
          name: specifier.local.name,
          filePath: path.join(GESTALT_SRC, nodePath.node.source.value),
        });
      });
    },
  });

  return imports;
}

async function gestaltVersion() {
  return JSON.parse(
    await fs.promises.readFile(
      path.join(GESTALT_SRC, "../package.json"),
      "utf-8"
    )
  ).version;
}

// Escape dollar signs in prop values so we don't get the following exception:
// One or more snippets very likely confuse snippet-variables and snippet-placeholders
// (see https://code.visualstudio.com/docs/editor/userdefinedsnippets#_snippet-syntax for more details)
function escapePropValue(propValue) {
  return propValue.replace(/\$/g, "\\$");
}

function convertToPropValues(propsInfo) {
  return Object.entries(propsInfo).reduce((acc, [propName, propOptions]) => {
    if (propName === "children") {
      return acc;
    } else if (propOptions?.flowType?.name === "union") {
      const allLiterals = propOptions?.flowType.elements.every(
        ({ name }) => name === "literal"
      );
      return {
        ...acc,
        [propName]: escapePropValue(
          allLiterals
            ? `|${propOptions?.flowType.elements
                .map((element) => element.value.replace(/\'/g, ""))
                .join(",")}|`
            : `:${propOptions?.flowType?.elements
                .map((element) => element.name)
                .join(" | ")}`
        ),
      };
    } else if (
      propOptions?.flowType?.name === "boolean" ||
      propOptions?.type?.name === "bool"
    ) {
      return {
        ...acc,
        [propName]: `|true,false|`,
      };
    } else if (
      [propOptions?.type?.name, propOptions?.flowType?.name].includes("string")
    ) {
      return {
        ...acc,
        [propName]: `:string`,
      };
    } else if (
      [propOptions?.type?.name, propOptions?.flowType?.name].includes("number")
    ) {
      return {
        ...acc,
        [propName]: `:number`,
      };
    } else {
      return {
        ...acc,
        [propName]: escapePropValue(
          `:${
            propOptions?.flowType?.raw?.replace(/\s\s+/g, " ") ??
            propOptions?.type?.name
          }`
        ),
      };
    }
  }, {});
}

(async function init() {
  await cloneGestalt();

  const [imports, version] = await Promise.all([
    gestaltImports(),
    gestaltVersion(),
  ]);

  const mappedImports = await Promise.all(
    imports.map(async ({ filePath, name }) => {
      const contents = await fs.promises.readFile(filePath);
      try {
        // React docgen does not yet support hooks: https://github.com/reactjs/react-docgen/issues/332
        if (name.startsWith("use")) {
          return null;
        }

        return {
          docgen: reactDocgenParse(contents),
          filePath,
          name,
        };
      } catch (error) {
        console.error(`${filePath}: ${error.message}`);
        return null;
      }
    })
  );

  const output = mappedImports.filter(Boolean).map(({ docgen, name }) => {
    const requiredProps = docgen.props
      ? convertToPropValues(
          Object.fromEntries(
            Object.entries(docgen.props).filter(([_, propOptions]) => {
              return propOptions.required;
            })
          )
        )
      : null;

    const hasChildrenProp = Boolean(docgen?.props?.children);
    const props = requiredProps
      ? Object.entries(requiredProps).map(([propName, propValue], index) => {
          const [leftDelimiter, rightDelimiter] =
            propValue.startsWith(":") || propValue === "|true,false|"
              ? [`{`, `}`]
              : ['"', '"'];

          return `\t${propName}=${leftDelimiter}\${${
            index + 1
          }${propValue}}${rightDelimiter}`;
        })
      : null;

    return {
      description: docgen.description,
      prefix: `<${name}`,
      name,
      scope: "javascript,typescript,javascriptreact",
      body:
        !props?.length && hasChildrenProp
          ? [`<${name}>`, "\t${0:node}", `</${name}>`]
          : [
              `<${name}`,
              ...(props?.length ? props : []),
              hasChildrenProp
                ? `>\${${props?.length ? props.length + 1 : 0}:node}</${name}>`
                : "/>",
            ].filter(Boolean),
    };
  });

  const snippetsFilePath = path.join("src", "snippets.json");
  await fs.promises.writeFile(
    snippetsFilePath,
    prettier.format(
      JSON.stringify(
        {
          gestaltVersion: version,
          snippets: output,
        },
        null,
        2
      ),
      {
        filepath: snippetsFilePath,
      }
    )
  );
})();
