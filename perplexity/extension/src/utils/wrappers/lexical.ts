export function setLexicalEditorContent({
  content,
  activeTextbox,
}: {
  content: string;
  activeTextbox: HTMLElement;
}) {
  if (!(activeTextbox instanceof HTMLElement)) return;

  if (activeTextbox.contentEditable !== "true") return;

  if (!("__lexicalEditor" in activeTextbox)) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editor = activeTextbox.__lexicalEditor as any;

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

export async function getLexicalEditorJsonContent(activeTextbox: HTMLElement) {
  // const activeElement = $(
  //   `${domSelectors.QUERY_BOX.TEXTBOX.ARBITRARY}:last`,
  // )[0];

  if (!(activeTextbox instanceof HTMLElement)) return;

  if (activeTextbox.contentEditable !== "true") return;

  if (!("__lexicalEditor" in activeTextbox)) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editor = activeTextbox.__lexicalEditor as any;

  const editorState = editor.getEditorState();

  console.log(JSON.stringify(editorState.toJSON()));

  return JSON.stringify(editorState.toJSON());
}
