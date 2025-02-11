export function identifyAllElements(
  node: Node,
  rawPrefix?: string | null,
  watch = true,
) {
  const prefix = rawPrefix ? `${rawPrefix}-` : "";

  node.childNodes.forEach((childNode, key) => {
    if (
      childNode instanceof Element &&
      childNode.getAttribute("data-kria-ignore") === null
    ) {
      const id = `${prefix}${key}`;
      childNode.setAttribute("data-kria-id", id);
      identifyAllElements(childNode, id, false);
    }
  });

  if (watch) {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === "childList" &&
          mutation.target instanceof Element &&
          mutation.target.getAttribute("data-kria-ignore") === null
        ) {
          identifyAllElements(
            mutation.target,
            mutation.target.getAttribute("data-kria-id"),
            false,
          );
        }
      }
    });

    observer.observe(node, {
      subtree: true,
      childList: true,
    });

    return observer;
  }
}
