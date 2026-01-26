import { ESLintUtils } from "@typescript-eslint/utils";
import ts from "typescript";

const createRule = ESLintUtils.RuleCreator(() => "");

/**
 * @typedef {Object} TypeRequirement
 * @property {"default" | "named"} type - Whether to check the default export or a named export
 * @property {string} [exportName] - For named exports, the specific export name to check. If omitted, any named export matching the type is accepted
 * @property {Object} tsType - The TypeScript type to enforce
 * @property {string} tsType.name - The name of the TypeScript type/interface to check against
 * @property {string} tsType.path - The module path where the type is defined (e.g., "@/__registries__/types")
 * @property {string} [message] - Custom error message to display when the export is missing or incorrect
 */

/**
 * ESLint rule to enforce that files export variables with specific TypeScript types.
 *
 * This rule validates that:
 * - Default exports match a specified type from a specified module
 * - Named exports match specified types from specified modules
 * - Export names match expected names (for named exports)
 *
 * @example
 * // Enforce default export of a specific type
 * {
 *   "typed-exports/typed-exports": ["error", [
 *     {
 *       type: "default",
 *       tsType: {
 *         name: "MyType",
 *         path: "@/types/my-types"
 *       }
 *     }
 *   ]]
 * }
 *
 * @example
 * // Enforce named export with a specific name and type
 * {
 *   "typed-exports/typed-exports": ["error", [
 *     {
 *       type: "named",
 *       exportName: "myExport",
 *       tsType: {
 *         name: "MyExportType",
 *         path: "@/types/exports"
 *       }
 *     }
 *   ]]
 * }
 *
 * @example
 * // Enforce both default and named exports
 * {
 *   "typed-exports/typed-exports": ["error", [
 *     {
 *       type: "default",
 *       tsType: {
 *         name: "DefaultType",
 *         path: "@/types/defaults"
 *       }
 *     },
 *     {
 *       type: "named",
 *       exportName: "namedExport",
 *       tsType: {
 *         name: "NamedType",
 *         path: "@/types/named"
 *       }
 *     }
 *   ]]
 * }
 *
 * @example
 * // Use a custom error message
 * {
 *   "typed-exports/typed-exports": ["error", [
 *     {
 *       type: "default",
 *       tsType: {
 *         name: "MyConfig",
 *         path: "@/types/config"
 *       },
 *       message: "Configuration files must export a valid MyConfig object"
 *     }
 *   ]]
 * }
 */
const typedExportsPlugin = createRule({
  name: "typed-exports",
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforce that files export variables with specific types from specific files",
    },
    messages: {
      missingRequiredExport:
        "File must export {{exportType}} of type {{typeName}} from {{typePath}}",
      incorrectExportType:
        "Export {{exportName}} must be of type {{typeName}} from {{typePath}}, but got {{actualType}}",
      incorrectExportName: "Named export must be called {{expectedName}}",
      wrongImportSource:
        "Type {{typeName}} must be imported from {{expectedPath}}",
      customMessage: "{{message}}",
    },
    /**
     * Schema for the rule options.
     * Accepts an array of export requirements, where each requirement specifies:
     * - type: "default" | "named" - The export type to validate
     * - exportName: string (optional) - For named exports, the specific name to check
     * - tsType: { name: string, path: string } - The TypeScript type and its module path
     * - message: string (optional) - Custom error message to display
     */
    schema: [
      {
        type: "array",
        items: {
          type: "object",
          properties: {
            type: { type: "string", enum: ["default", "named"] },
            exportName: { type: "string" },
            tsType: {
              type: "object",
              properties: {
                name: { type: "string" },
                path: { type: "string" },
              },
              required: ["name", "path"],
            },
            message: { type: "string" },
          },
          required: ["type", "tsType"],
        },
      },
    ],
  },
  defaultOptions: [[]],
  create(context) {
    const exportRequirements = context.options[0] || [];
    const filename = context.filename;

    if (exportRequirements.length === 0) return {};

    const foundExports = { default: null, named: new Map() };
    const expectedTypeCache = new Map();

    // Helpers
    const getTypeInfo = (node) => {
      const parserServices = context.sourceCode.parserServices;
      if (
        !parserServices ||
        !parserServices.program ||
        !parserServices.esTreeNodeToTSNodeMap
      )
        return null;
      try {
        const checker = parserServices.program.getTypeChecker();
        const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);
        if (!tsNode) return null;
        const type = checker.getTypeAtLocation(tsNode);
        const typeString = checker.typeToString(type);
        const symbol = type.getSymbol() || type.aliasSymbol;
        return { type, typeString, symbol, checker };
      } catch {
        return null;
      }
    };

    const getExpectedType = (typeName, typePath, checker) => {
      const cacheKey = `${typeName}|${typePath}`;
      if (expectedTypeCache.has(cacheKey)) {
        return expectedTypeCache.get(cacheKey);
      }
      const program = context.sourceCode.parserServices.program;
      const localChecker = checker || program.getTypeChecker();
      const resolved = ts.resolveModuleName(
        typePath,
        filename,
        program.getCompilerOptions(),
        ts.sys,
      );
      if (!resolved.resolvedModule) return null;
      const sourceFile = program.getSourceFile(
        resolved.resolvedModule.resolvedFileName,
      );
      if (!sourceFile) return null;
      const moduleSymbol =
        localChecker.getSymbolAtLocation(sourceFile) || sourceFile.symbol;
      if (!moduleSymbol) return null;
      const exports = localChecker.getExportsOfModule(moduleSymbol);
      let typeSymbol = exports.find((exp) => exp.name === typeName);
      if (!typeSymbol) return null;
      if (typeSymbol.flags & ts.SymbolFlags.Alias) {
        typeSymbol = localChecker.getAliasedSymbol(typeSymbol);
      }
      let expectedType = null;
      const decl = typeSymbol.declarations && typeSymbol.declarations[0];
      if (decl && ts.isTypeAliasDeclaration(decl)) {
        expectedType = localChecker.getTypeFromTypeNode(decl.type);
      }
      if (!expectedType) {
        expectedType = localChecker.getDeclaredTypeOfSymbol(typeSymbol);
      }
      expectedTypeCache.set(cacheKey, expectedType);
      return expectedType;
    };

    const hasAllExpectedProperties = (actualType, expectedType, checker) => {
      const expectedProps = checker.getPropertiesOfType(expectedType);
      if (expectedProps.length === 0) return false;
      const actualProps = checker.getPropertiesOfType(actualType);
      if (actualProps.length === 0) return false;
      const actualNames = new Set(actualProps.map((p) => p.name));
      return expectedProps.every((p) => actualNames.has(p.name));
    };

    const matchesExpectedType = (actual, expected, checker) => {
      const actualSym = actual.aliasSymbol || actual.symbol;
      const expectedSym = expected.aliasSymbol || expected.symbol;
      return (
        (actualSym && expectedSym && actualSym === expectedSym) ||
        checker.isTypeAssignableTo(actual, expected) ||
        hasAllExpectedProperties(actual, expected, checker)
      );
    };

    const recordExport = (name, node, typeInfo) => {
      if (!typeInfo) return;
      const data = {
        node,
        type: typeInfo.type,
        typeString: typeInfo.typeString,
        symbol: typeInfo.symbol,
        checker: typeInfo.checker,
      };
      if (name === null) {
        foundExports.default = data;
      } else {
        foundExports.named.set(name, data);
      }
    };

    const findMatchingNamedExport = (typeName, typePath, checker) => {
      for (const [, data] of foundExports.named) {
        const expectedType = getExpectedType(typeName, typePath, checker);
        if (!expectedType) continue;
        if (matchesExpectedType(data.type, expectedType, checker)) {
          return data;
        }
      }
      return null;
    };

    const validateExport = (
      exportData,
      typeName,
      typePath,
      exportName,
      customMessage,
    ) => {
      if (!exportData) {
        if (customMessage) {
          context.report({
            node: context.sourceCode.ast,
            messageId: "customMessage",
            data: { message: customMessage },
          });
        } else {
          const exportType =
            exportName === null
              ? "default"
              : exportName
                ? `named export '${exportName}'`
                : "named";
          context.report({
            node: context.sourceCode.ast,
            messageId: "missingRequiredExport",
            data: { exportType, typeName, typePath },
          });
        }
        return;
      }
      const expectedType = getExpectedType(
        typeName,
        typePath,
        exportData.checker,
      );
      if (!expectedType) return;
      if (
        !matchesExpectedType(exportData.type, expectedType, exportData.checker)
      ) {
        if (customMessage) {
          context.report({
            node: exportData.node,
            messageId: "customMessage",
            data: { message: customMessage },
          });
        } else {
          const displayName =
            exportName === null
              ? "default export"
              : exportName || "named export";
          context.report({
            node: exportData.node,
            messageId: "incorrectExportType",
            data: {
              exportName: displayName,
              typeName,
              typePath,
              actualType: exportData.typeString,
            },
          });
        }
      }
    };

    return {
      ExportDefaultDeclaration(node) {
        const typeInfo = getTypeInfo(node.declaration);
        recordExport(null, node, typeInfo);
      },

      ExportNamedDeclaration(node) {
        if (node.declaration) {
          if (
            node.declaration.type === "VariableDeclaration" &&
            node.declaration.declarations.length > 0
          ) {
            const varDecl = node.declaration.declarations[0];
            if (varDecl.id.type === "Identifier") {
              const typeInfo = getTypeInfo(varDecl.id);
              recordExport(varDecl.id.name, node, typeInfo);
            }
          }
        }
        if (node.specifiers && node.specifiers.length > 0) {
          for (const specifier of node.specifiers) {
            if (specifier.type === "ExportSpecifier") {
              const typeInfo = getTypeInfo(specifier.local);
              if (!typeInfo) continue;
              const exportedName =
                specifier.exported.type === "Identifier"
                  ? specifier.exported.name
                  : specifier.exported.value;
              recordExport(exportedName, node, typeInfo);
            }
          }
        }
      },

      "Program:exit"() {
        for (const req of exportRequirements) {
          const { type, exportName, tsType, message } = req;
          if (type === "default") {
            validateExport(
              foundExports.default,
              tsType.name,
              tsType.path,
              null,
              message,
            );
          } else if (type === "named") {
            let exportData = null;
            if (exportName) {
              exportData = foundExports.named.get(exportName);
            } else {
              exportData = findMatchingNamedExport(
                tsType.name,
                tsType.path,
                // Use any checker available; they're all equivalent
                foundExports.named.values().next().value?.checker ||
                  foundExports.default?.checker,
              );
            }
            validateExport(
              exportData,
              tsType.name,
              tsType.path,
              exportName,
              message,
            );
          }
        }
      },
    };
  },
});

export default typedExportsPlugin;
