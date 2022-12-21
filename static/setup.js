function setupPage() {
  const headerPrefixColor="#cb4b16";

  const toTopButton = document.createElement("button");
  toTopButton.classList.add('to-top-button');
  toTopButton.append('^');
  document.body.prepend(toTopButton);

  toTopButton.addEventListener("click", () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  });

  let headerPrefix = "# ";
  const headerQuerySelectors = ["h2", "h3", "h4", "h5", "h6"];
  headerQuerySelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((header) => {
      const prefixSpan = document.createElement("span");
      prefixSpan.style.color = headerPrefixColor;
      prefixSpan.innerText = headerPrefix;

      header.prepend(prefixSpan);
    });
    headerPrefix = "#" + headerPrefix;
  });
}

document.addEventListener("DOMContentLoaded", setupPage);
