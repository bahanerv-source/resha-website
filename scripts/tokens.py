"""Regenerates src/styles/tokens.css from src/styles/tokens.source.json (a copy of the ريشة design system's tokens.json).
Run after updating the design system:  python3 scripts/tokens.py"""
import json, os, re
here = os.path.dirname(__file__)
t = json.load(open(os.path.join(here, '../src/styles/tokens.source.json')))
res = lambda v: (lambda m: f"var(--{m.group(1)})" if m else v)(re.fullmatch(r'\{(.+)\}', v))
L = ["/* ريشة design tokens — generated from the design system's tokens.json (scripts/tokens.py). Do not hand-edit values here: change tokens.source.json and regenerate. */", ":root {", "  /* Colour */"]
L += [f"  --{c['name']}: {res(c['value'])};" for c in t['color']['tokens']]
L += ["  /* Type */", f"  --font-display: {t['type']['families']['display']};", f"  --font-ui: {t['type']['families']['ui']};"]
for title, key in [('Space', 'spacing'), ('Radius', 'radius'), ('Shadow', 'shadow'), ('Layout', 'layout')]:
    L.append(f"  /* {title} */"); L += [f"  --{s['name']}: {s['value']};" for s in t[key]['tokens']]
L.append("}")
open(os.path.join(here, '../src/styles/tokens.css'), 'w').write("\n".join(L) + "\n")
print('tokens.css written')
