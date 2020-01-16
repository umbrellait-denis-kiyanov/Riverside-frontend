import IceInputPlugin from './ice-input-plugin';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs/operators';

// implement Undo/Redo functionality
export default class UndoTrackPlugin extends IceInputPlugin {

    protected addEventListeners(editor) {

        editor.change$ = new BehaviorSubject<string>('');

        editor.change$.pipe(
            skip(1),
            debounceTime(1000)
        ).subscribe(html => {
            editor.stack = editor.stack.slice(0, editor.stackIndex + 1);

            if (editor.stack[editor.stackIndex] !== html) {
                editor.stack.push(html);
                editor.stackIndex = editor.stack.length;
                console.log('Adding to stack', editor.stackIndex);
            }
        });
    }

    keyDown(e: KeyboardEvent) {
        const editor = e.target as any;

        if (!editor.stackIndex) {
            editor.stack = [editor.innerHTML];
        }

        if (e.ctrlKey && e.key === 'z') {
            editor.stackIndex = Math.max(0, editor.stackIndex - 1);
            editor.innerHTML = editor.stack[editor.stackIndex];
            console.log('Restoring from stack', editor.stackIndex);
            return true;
        }

        if (e.ctrlKey && e.key === 'y') {
            editor.stackIndex = Math.min(editor.stack.length - 1, editor.stackIndex + 1);
            editor.innerHTML = editor.stack[editor.stackIndex];
            return true;
        }

        editor.change$.next(editor.innerHTML);

        // console.log(editor.stack);

        return true;
    }
}