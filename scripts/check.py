"""Dependency-free checks for the static GitHub Pages site."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote

ROOT = Path(__file__).resolve().parent.parent

class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.path, self.ids, self.links, self.headings = path, set(), [], []
        self.feed(path.read_text(encoding="utf-8"))

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            assert attrs["id"] not in self.ids, f"Duplicate ID: {self.path} {attrs['id']}"
            self.ids.add(attrs["id"])
        if tag == "h1":
            self.headings.append(tag)
        if tag == "img":
            assert attrs.get("alt") or (attrs.get("alt") == "" and attrs.get("aria-hidden") == "true"), f"Missing alt: {self.path}"
            assert attrs.get("width") and attrs.get("height"), "Missing image dimensions"
        if tag == "video":
            assert "controls" in attrs and "autoplay" not in attrs
            assert attrs.get("preload") == "none"
        for attr in ("href", "src", "poster"):
            if attrs.get(attr):
                self.links.append(attrs[attr])

pages = {p.resolve(): Page(p) for p in [ROOT / "index.html", *sorted((ROOT / "pages").glob("*.html"))]}
count = 0
for path, page in pages.items():
    assert len(page.headings) == 1, f"Expected one h1: {path}"
    for link in page.links:
        url = urlsplit(link)
        if url.scheme or url.netloc:
            continue
        target = (path.parent / unquote(url.path)).resolve() if url.path else path
        assert target.is_file(), f"Missing resource: {path}: {link}"
        if url.fragment and target in pages:
            assert unquote(url.fragment) in pages[target].ids, f"Missing anchor: {link}"
        count += 1
print(f"PASS: {len(pages)} pages, {count} local references, unique IDs, image alternatives and video settings.")
