# VSCode MCP Bridge Guidelines

## Critical: Lowercase Drive Letter

Always use lowercase drive letter for workspace path on Windows:

```
❌ D:\...
✅ d:\...
```

Case mismatch causes connection failure (pipe ID is hashed from path).

## get_diagnostics

**For quick type checking/linting after edits** - much faster since CLI commands scan entire workspace.

**Mandatory:** Files MUST be opened first using `open_files`, otherwise no diagnostics returned.

Workflow: `open_files` → `get_diagnostics`

## get_references / get_symbol_lsp_info / rename_symbol

Use `codeSnippet` parameter for disambiguation when symbol name is ambiguous (e.g., type vs function with same name), otherwise you get "multiple occurrences" error.

## DO NOT USE

- `execute_command`
- `list_workspaces`
