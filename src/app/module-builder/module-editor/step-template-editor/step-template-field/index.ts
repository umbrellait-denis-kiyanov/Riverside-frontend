export type TemplateField = [
  string,
  (
    | "json"
    | "text-input"
    | "string"
    | "resource"
    | "select"
    | "number"
    | "Module"
    | Array<string>
  )
];
