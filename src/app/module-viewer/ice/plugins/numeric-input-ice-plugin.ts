import IceInputPlugin from './ice-input-plugin';

// only allow numeric input
export class NumericInputPlugin extends IceInputPlugin {
  public addEventListeners(element: HTMLElement) {
    const observer = new MutationObserver(changes => {
      let node: Node;
      // tslint:disable-next-line
      const walk = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );
      const nodes: Node[] = [];
      // tslint:disable-next-line
      while ((node = walk.nextNode())) {
        nodes.push(node);
      }

      nodes
        .filter(
          n =>
            n.textContent.length !== 1 &&
            /* ^^ not 100% sure why it's necessary, but it prevents typing within a deleted block */
            n.textContent.match(/[^0-9]/)
        )
        .forEach(n => (n.textContent = n.textContent.split(/[^0-9]/).join('')));

      this.ice.getCurrentRange().collapse();
    });

    observer.observe(element, {
      subtree: true,
      childList: true,
      characterData: true
    });
  }
}
