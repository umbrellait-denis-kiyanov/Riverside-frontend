import { Module } from './module-editor/module.interface';
export const modules: Module[] = [createDemoSteps(1, 'Buying Personas'), createDemoSteps(2, 'Another module')];
export function createDemoSteps(id: number, name: string): Module {
  return {
    id,
    name,
    google_doc_url: '',
    steps: [
      {
        description: 'Brainstorm Buying Personas',
        elements: [
          {
            type: 'pdf',
            data: 'some data here'
          },
          {
            type: 'youtube',
            data: 'youtube video here'
          }
        ]
      },
      {
        description: 'Narrow Down to 5',
        elements: [
          {
            type: 'pdf',
            data: 'some data here'
          }
        ]
      }
    ]
  };
}
