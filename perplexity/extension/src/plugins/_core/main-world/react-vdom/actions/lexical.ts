import { DomSelectorsService } from "@/services/cplx-api/versioned-remote-resources/dom-selectors";

export async function setLexicalEditorContent({
  content,
}: {
  content: string;
}) {
  const domSelectors = await DomSelectorsService.mainWorldCached();

  const activeElement = $(
    `${domSelectors.QUERY_BOX.TEXTBOX.ARBITRARY}:last`,
  )[0];

  if (!(activeElement instanceof HTMLElement)) return;

  if (activeElement.contentEditable !== "true") return;

  if (!("__lexicalEditor" in activeElement)) return;

  const editor = activeElement.__lexicalEditor as any;

  const textState = JSON.stringify({
    root: {
      children: [
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              text: content,
              type: "text",
              version: 1,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "paragraph",
          version: 1,
        },
      ],
      direction: "ltr",
      format: "",
      indent: 0,
      type: "root",
      version: 1,
    },
  });

  const editorState = editor.parseEditorState(textState);
  editor.setEditorState(editorState);
  editor.focus();
}

export async function getLexicalEditorJsonContent() {
  const domSelectors = await DomSelectorsService.mainWorldCached();

  const activeElement = $(
    `${domSelectors.QUERY_BOX.TEXTBOX.ARBITRARY}:last`,
  )[0];

  if (!(activeElement instanceof HTMLElement)) return;

  if (activeElement.contentEditable !== "true") return;

  if (!("__lexicalEditor" in activeElement)) return;

  const editor = activeElement.__lexicalEditor as any;

  const editorState = editor.getEditorState();

  console.log(JSON.stringify(editorState.toJSON()));

  return JSON.stringify(editorState.toJSON());
}
