import IceInputPlugin from './ice-input-plugin';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, filter, skip, takeWhile, finalize } from 'rxjs/operators';

type Editor = HTMLElement & {
                change$: BehaviorSubject<string>;
                stack: string[];
                stackIndex: number;
              }

// implement Undo/Redo functionality
export class UndoTrackPlugin extends IceInputPlugin {

    protected addEventListeners(editor: Editor) {

        editor.change$ = new BehaviorSubject('');

        editor.stack = [];

        const observer = new MutationObserver(_ => editor.change$.next(editor.innerHTML));

        observer.observe(editor, {
            attributes: true,
            subtree: true,
            childList: true,
            characterData: true
          });

        editor.change$.pipe(
            skip(1),
            debounceTime(500),
            filter(html => html !== null && editor.stack[editor.stackIndex] !== html),
            takeWhile(_ => !!editor.parentElement),
            finalize(() => observer.disconnect())
        ).subscribe(html => {
            editor.stack = editor.stack.slice(0, editor.stackIndex + 2);
            editor.stack.push(html);
            editor.stackIndex = editor.stack.length - 1;
        });
    }

    keyDown(e: KeyboardEvent) {
        if (e.ctrlKey && (e.key === 'z' || e.key === 'y')) {
            const editor = e.target as Editor;

            if (e.key === 'z') {
                editor.stack[editor.stackIndex] = editor.innerHTML;
                editor.stackIndex = Math.max(0, editor.stackIndex - 1);
            }

            if (e.key === 'y') {
                editor.stackIndex = Math.min(editor.stack.length - 1, editor.stackIndex + 1);
            }

            editor.innerHTML = editor.stack[editor.stackIndex];
            editor.change$.next(null);
        }

        return true;
    }
}