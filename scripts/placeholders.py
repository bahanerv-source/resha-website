"""Generates the stand-in still lifes in public/images/placeholders/ (same visual language as the
design system's Placeholders). They are NOT photography: replace each with a real photo before launch.
Run: python3 scripts/placeholders.py"""
import os
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'images', 'placeholders')

def defs(wall_top, wall_bot, glow='#ffffff', glow_op=.35):
    return f'''<defs>
<linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{wall_top}"/><stop offset="1" stop-color="{wall_bot}"/></linearGradient>
<radialGradient id="glow" cx=".62" cy=".32" r=".6"><stop offset="0" stop-color="{glow}" stop-opacity="{glow_op}"/><stop offset="1" stop-color="{glow}" stop-opacity="0"/></radialGradient>
<radialGradient id="shadow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#22201E" stop-opacity=".35"/><stop offset="1" stop-color="#22201E" stop-opacity="0"/></radialGradient>
<linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E6CF9C"/><stop offset=".45" stop-color="#C7A15B"/><stop offset="1" stop-color="#8C6A2E"/></linearGradient>
<linearGradient id="silver" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F2F2EE"/><stop offset=".5" stop-color="#C9CCCF"/><stop offset="1" stop-color="#8E9296"/></linearGradient>
<linearGradient id="bronze" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E2B48A"/><stop offset=".5" stop-color="#A86B3C"/><stop offset="1" stop-color="#6E4222"/></linearGradient>
<linearGradient id="wood" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5A3622"/><stop offset=".5" stop-color="#7A4E2D"/><stop offset="1" stop-color="#4E2E1C"/></linearGradient>
<linearGradient id="lightwood" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#D9B98C"/><stop offset="1" stop-color="#A97E50"/></linearGradient>
<linearGradient id="burg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8A2E3C"/><stop offset="1" stop-color="#4C121C"/></linearGradient>
<linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".85"/><stop offset=".5" stop-color="#E9EEF0" stop-opacity=".55"/><stop offset="1" stop-color="#FFFFFF" stop-opacity=".75"/></linearGradient>
</defs>'''

def tall(wall, floor, body, glow='#ffffff', glow_op=.35, floor_y=760):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">{defs(*wall, glow, glow_op)}'
            f'<rect width="800" height="1000" fill="url(#wall)"/><rect width="800" height="1000" fill="url(#glow)"/>'
            f'<rect x="0" y="{floor_y}" width="800" height="{1000-floor_y}" fill="{floor}"/>{body}</svg>')

def wide(wall, floor, body, glow='#F7F1E8', glow_op=.22, floor_y=560, ledge='#C7A15B'):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 700" width="1600" height="700">{defs(*wall, glow, glow_op)}'
            f'<rect width="1600" height="700" fill="url(#wall)"/><rect width="1600" height="700" fill="url(#glow)"/>'
            f'<rect x="0" y="{floor_y}" width="1600" height="{700-floor_y}" fill="{floor}"/><rect x="0" y="{floor_y}" width="1600" height="6" fill="{ledge}" opacity=".5"/>{body}</svg>')

CREAM = ('#F4ECDF', '#E6D8C4'); SAND = ('#EFE5D6', '#E2D4C0'); IVORY = ('#F7F1E8', '#EADFCF')
BURG = ('#6B1F2B', '#4C121C'); CHAR = ('#3A332E', '#22201E')
lines = lambda x, y, ws, c='#6E5222', op=.45, h=10, gap=26: ''.join(
    f'<rect x="{x - w/2}" y="{y + i*gap}" width="{w}" height="{h}" rx="{h/2}" fill="{c}" opacity="{op}"/>' for i, w in enumerate(ws))

S = {}
S['acrylic-plaque'] = tall(CREAM, '#D9C8B0', f'''<ellipse cx="400" cy="772" rx="230" ry="22" fill="url(#shadow)"/>
<rect x="210" y="690" width="380" height="80" rx="8" fill="url(#wood)"/>
<rect x="250" y="230" width="300" height="470" rx="10" fill="url(#glass)" stroke="#FFFFFF" stroke-width="3"/>
<path d="M262 250 L330 250 L262 420Z" fill="#fff" opacity=".55"/>
<circle cx="400" cy="340" r="44" fill="none" stroke="#C7A15B" stroke-width="5"/>
<path d="M383 340 l12 12 24 -26" fill="none" stroke="#C7A15B" stroke-width="5" stroke-linecap="round"/>
{lines(400, 420, [190, 140, 170, 120], '#9C7A3C', .55)}<rect x="350" y="600" width="100" height="8" rx="4" fill="#C7A15B" opacity=".7"/>''')

S['crystal-award'] = tall(BURG, '#3A2B26', f'''<rect x="0" y="760" width="800" height="5" fill="#C7A15B" opacity=".5"/>
<ellipse cx="400" cy="772" rx="200" ry="20" fill="url(#shadow)"/>
<rect x="270" y="660" width="260" height="110" rx="6" fill="#22201E"/><rect x="320" y="692" width="160" height="40" rx="3" fill="url(#gold)"/>
<path d="M300 660 L300 330 L400 190 L500 330 L500 660Z" fill="url(#glass)" opacity=".9"/>
<path d="M300 330 L400 190 L400 660 L300 660Z" fill="#fff" opacity=".25"/>
<path d="M400 190 L500 330 L400 330Z" fill="#fff" opacity=".45"/>
<circle cx="400" cy="440" r="46" fill="none" stroke="#C7A15B" stroke-width="5"/>{lines(400, 520, [140, 100], '#C7A15B', .7, 8, 22)}''', glow='#F7F1E8', glow_op=.22)

S['pen-box'] = tall(SAND, '#7A4E2D', f'''<ellipse cx="400" cy="790" rx="280" ry="24" fill="url(#shadow)"/>
<g transform="rotate(-6 400 640)"><rect x="150" y="560" width="500" height="200" rx="10" fill="url(#wood)"/>
<rect x="172" y="580" width="456" height="160" rx="6" fill="#4C121C"/>
<rect x="210" y="640" width="380" height="26" rx="13" fill="#22201E"/><rect x="520" y="640" width="70" height="26" rx="10" fill="url(#gold)"/><rect x="230" y="646" width="120" height="6" rx="3" fill="#C7A15B" opacity=".8"/></g>
<g transform="rotate(-14 420 420)"><rect x="170" y="300" width="500" height="200" rx="12" fill="url(#wood)"/><rect x="330" y="370" width="180" height="60" rx="6" fill="url(#gold)"/>{lines(420, 385, [120, 80], '#6E5222', .55, 8, 20)}</g>''', floor_y=720)

S['ceramic-mug'] = tall(IVORY, '#D9C8B0', f'''<ellipse cx="400" cy="772" rx="210" ry="22" fill="url(#shadow)"/>
<path d="M540 420 C650 420 650 620 540 620" fill="none" stroke="#F2EDE5" stroke-width="34"/>
<path d="M540 420 C650 420 650 620 540 620" fill="none" stroke="#D9CDBD" stroke-width="4" opacity=".6"/>
<rect x="240" y="330" width="310" height="440" rx="26" fill="#FBF8F3"/><rect x="240" y="330" width="310" height="440" rx="26" fill="none" stroke="#E2D6C6" stroke-width="3"/>
<rect x="240" y="330" width="310" height="16" rx="8" fill="url(#gold)"/>
<path d="M300 470 q40 -60 95 -10 t95 0" fill="none" stroke="#6B1F2B" stroke-width="10" stroke-linecap="round"/>{lines(395, 530, [170, 120], '#6B1F2B', .7, 9, 26)}
<rect x="252" y="350" width="22" height="400" rx="11" fill="#fff" opacity=".7"/>''')

S['graduation-sash'] = tall(CHAR, '#22201E', f'''<path d="M260 120 L400 760 L540 120" fill="none" stroke="url(#burg)" stroke-width="120" stroke-linejoin="bevel"/>
<path d="M330 260 L400 600" stroke="#C7A15B" stroke-width="6" opacity=".9"/><path d="M470 260 L420 500" stroke="#C7A15B" stroke-width="6" opacity=".9"/>
<path d="M200 140 L330 140" stroke="#C7A15B" stroke-width="5"/><path d="M470 140 L600 140" stroke="#C7A15B" stroke-width="5"/>
<path d="M340 760 L400 860 L460 760Z" fill="#4C121C"/><path d="M360 860 l40 60 l40 -60" fill="none" stroke="url(#gold)" stroke-width="10"/>''', glow='#D8BC84', glow_op=.25, floor_y=900)

S['certificate-frame'] = tall(IVORY, '#7A4E2D', f'''<ellipse cx="400" cy="740" rx="270" ry="22" fill="url(#shadow)"/>
<rect x="160" y="200" width="480" height="540" rx="6" fill="url(#gold)"/><rect x="184" y="224" width="432" height="492" fill="#FCF8F2"/>
<rect x="206" y="246" width="388" height="448" fill="none" stroke="#C7A15B" stroke-width="2"/>
<path d="M330 300 q70 -40 140 0" fill="none" stroke="#6B1F2B" stroke-width="8" stroke-linecap="round"/>{lines(400, 350, [240, 200, 260, 180, 220], '#3A2B26', .35, 8, 30)}
<circle cx="500" cy="630" r="38" fill="#6B1F2B"/><circle cx="500" cy="630" r="28" fill="none" stroke="#D8BC84" stroke-width="3"/><path d="M480 664 l-10 50 l30 -18 l30 18 l-10 -50" fill="#6B1F2B"/>
<rect x="250" y="640" width="140" height="6" rx="3" fill="#3A2B26" opacity=".4"/>''', floor_y=730)

S['custom-notebook'] = tall(SAND, '#D9C8B0', f'''<ellipse cx="400" cy="772" rx="250" ry="24" fill="url(#shadow)"/>
<g transform="rotate(4 400 500)"><rect x="210" y="240" width="380" height="520" rx="12" fill="url(#burg)"/><rect x="210" y="240" width="40" height="520" rx="8" fill="#4C121C"/>
<rect x="300" y="380" width="230" height="110" rx="8" fill="url(#gold)"/>{lines(415, 410, [150, 100], '#6E5222', .6, 10, 28)}
<rect x="590" y="300" width="10" height="440" fill="#F7F1E8"/></g>
<g transform="rotate(-8 230 700)"><rect x="110" y="600" width="230" height="150" rx="6" fill="#FCF8F2"/>
<rect x="130" y="620" width="88" height="34" rx="17" fill="#F3E6E3"/><rect x="232" y="620" width="88" height="34" rx="17" fill="#F3E6E3"/><rect x="130" y="668" width="88" height="34" rx="17" fill="#F3E9D4"/><rect x="232" y="668" width="88" height="34" rx="17" fill="#F3E9D4"/></g>''')

S['engraved-box'] = tall(CREAM, '#5A3622', f'''<ellipse cx="400" cy="760" rx="300" ry="26" fill="url(#shadow)"/>
<rect x="150" y="520" width="500" height="240" rx="10" fill="url(#lightwood)"/><rect x="150" y="520" width="500" height="240" rx="10" fill="none" stroke="#7A4E2D" stroke-width="3" opacity=".5"/>
<path d="M140 470 L660 470 L650 530 L150 530Z" fill="#C49A68"/><path d="M180 380 L620 380 L660 470 L140 470Z" fill="url(#lightwood)"/>
<ellipse cx="400" cy="425" rx="120" ry="28" fill="none" stroke="#7A4E2D" stroke-width="4" opacity=".7"/>
<path d="M340 425 q30 -18 60 0 t60 0" fill="none" stroke="#7A4E2D" stroke-width="4" opacity=".8"/>
<rect x="380" y="560" width="40" height="40" rx="4" fill="url(#gold)"/>''', floor_y=740)

S['keychain-wood'] = tall(CREAM, '#D9C8B0', f'''<ellipse cx="400" cy="772" rx="160" ry="18" fill="url(#shadow)"/>
<circle cx="400" cy="250" r="60" fill="none" stroke="url(#gold)" stroke-width="12"/><rect x="390" y="300" width="20" height="90" rx="6" fill="url(#gold)"/>
<circle cx="400" cy="540" r="170" fill="url(#lightwood)"/><circle cx="400" cy="540" r="150" fill="none" stroke="#7A4E2D" stroke-width="3" opacity=".5"/>
<circle cx="400" cy="400" r="16" fill="#E6D8C4"/><path d="M330 540 q35 -40 70 0 t70 0" fill="none" stroke="#5A3622" stroke-width="9" stroke-linecap="round"/>{lines(400, 590, [130, 80], '#5A3622', .55, 9, 26)}''')

S['wooden-medal'] = tall(SAND, '#D9C8B0', f'''<ellipse cx="400" cy="772" rx="170" ry="20" fill="url(#shadow)"/>
<path d="M300 40 L370 380 L430 380 L500 40Z" fill="url(#burg)"/><path d="M370 40 L400 380 L430 40Z" fill="#C7A15B" opacity=".8"/>
<circle cx="400" cy="540" r="180" fill="url(#lightwood)"/><circle cx="400" cy="540" r="150" fill="none" stroke="#7A4E2D" stroke-width="4" opacity=".6"/>
<path d="M400 440 l28 58 64 9 -46 45 11 63 -57 -30 -57 30 11 -63 -46 -45 64 -9z" fill="#6B1F2B" opacity=".85"/>''')

S['thank-you-frame'] = tall(IVORY, '#D9C8B0', f'''<ellipse cx="400" cy="772" rx="230" ry="22" fill="url(#shadow)"/>
<path d="M330 760 L400 640 L470 760" fill="none" stroke="#5A3622" stroke-width="10"/>
<rect x="190" y="200" width="420" height="520" rx="8" fill="url(#wood)"/><rect x="226" y="236" width="348" height="448" fill="#F7F1E8"/>
<path d="M290 400 c40 -80 120 -60 110 0 c-10 60 -90 50 -60 -10 c30 -50 160 -60 170 30" fill="none" stroke="#6B1F2B" stroke-width="9" stroke-linecap="round"/>
<path d="M300 500 q100 30 200 0" fill="none" stroke="#C7A15B" stroke-width="5"/>{lines(400, 550, [180, 120], '#3A2B26', .35, 8, 26)}''')

S['teacher-stamp'] = tall(SAND, '#D9C8B0', f'''<ellipse cx="300" cy="772" rx="160" ry="18" fill="url(#shadow)"/>
<rect x="220" y="560" width="160" height="210" rx="16" fill="url(#burg)"/><rect x="200" y="740" width="200" height="32" rx="6" fill="#22201E"/>
<ellipse cx="300" cy="520" rx="60" ry="70" fill="url(#burg)"/><rect x="250" y="620" width="100" height="40" rx="4" fill="url(#gold)"/>
<g transform="rotate(-10 540 400)"><rect x="420" y="250" width="260" height="320" rx="6" fill="#FCF8F2"/>
<circle cx="550" cy="400" r="80" fill="none" stroke="#6B1F2B" stroke-width="7" opacity=".75"/><path d="M520 400 l20 22 44 -48" fill="none" stroke="#6B1F2B" stroke-width="9" stroke-linecap="round" opacity=".75"/></g>''')

S['desk-nameplate'] = tall(CREAM, '#7A4E2D', f'''<ellipse cx="400" cy="720" rx="320" ry="24" fill="url(#shadow)"/>
<path d="M110 700 L690 700 L650 610 L150 610Z" fill="url(#wood)"/>
<rect x="140" y="380" width="520" height="240" rx="8" fill="url(#glass)" stroke="#fff" stroke-width="3"/>
<path d="M150 395 L260 395 L150 520Z" fill="#fff" opacity=".5"/>
<rect x="230" y="450" width="340" height="18" rx="9" fill="#6B1F2B" opacity=".8"/>{lines(400, 500, [220, 160], '#C7A15B', .9, 9, 26)}''', floor_y=700)

S['medal-trio'] = tall(BURG, '#3A2B26', f'''<rect x="0" y="760" width="800" height="5" fill="#C7A15B" opacity=".5"/><ellipse cx="400" cy="772" rx="300" ry="22" fill="url(#shadow)"/>
<path d="M140 120 L190 520 L230 520 L280 120Z" fill="#F7F1E8" opacity=".9"/><path d="M330 60 L380 470 L420 470 L470 60Z" fill="#D8BC84"/><path d="M520 120 L570 520 L610 520 L660 120Z" fill="#F7F1E8" opacity=".9"/>
<circle cx="210" cy="620" r="105" fill="url(#silver)"/><circle cx="400" cy="580" r="125" fill="url(#gold)"/><circle cx="590" cy="620" r="105" fill="url(#bronze)"/>
<circle cx="400" cy="580" r="95" fill="none" stroke="#8C6A2E" stroke-width="4" opacity=".6"/><circle cx="210" cy="620" r="78" fill="none" stroke="#8E9296" stroke-width="4" opacity=".6"/><circle cx="590" cy="620" r="78" fill="none" stroke="#6E4222" stroke-width="4" opacity=".6"/>''', glow='#F7F1E8', glow_op=.22)

S['acrylic-photo'] = tall(SAND, '#D9C8B0', f'''<ellipse cx="400" cy="772" rx="230" ry="22" fill="url(#shadow)"/>
<rect x="200" y="690" width="400" height="80" rx="6" fill="url(#lightwood)"/>
<rect x="230" y="220" width="340" height="480" rx="10" fill="#D8BC84"/><rect x="230" y="220" width="340" height="480" rx="10" fill="url(#glass)" opacity=".35"/>
<path d="M230 560 L340 430 L420 520 L480 460 L570 560 L570 690 L230 690Z" fill="#6B1F2B" opacity=".75"/><circle cx="470" cy="330" r="40" fill="#FCF8F2" opacity=".8"/>
<rect x="230" y="220" width="340" height="480" rx="10" fill="none" stroke="#fff" stroke-width="4"/><path d="M240 230 L330 230 L240 380Z" fill="#fff" opacity=".45"/>''')

S['school-labels'] = tall(IVORY, '#D9C8B0', f'''<ellipse cx="400" cy="772" rx="260" ry="22" fill="url(#shadow)"/>
<g transform="rotate(-5 400 500)"><rect x="180" y="230" width="440" height="540" rx="8" fill="#FFFFFF"/>
{''.join(f'<rect x="{210 + c*140}" y="{260 + r*82}" width="120" height="62" rx="31" fill="{["#F3E6E3", "#F3E9D4", "#EFE6D8"][(r + c) % 3]}"/><rect x="{235 + c*140}" y="{285 + r*82}" width="70" height="10" rx="5" fill="#6B1F2B" opacity=".55"/>' for r in range(6) for c in range(3))}</g>''')

S['campaign-graduation-wide'] = wide(CHAR, '#22201E', f'''<ellipse cx="520" cy="572" rx="380" ry="20" fill="url(#shadow)"/>
<path d="M150 560 L300 330 L450 560" fill="none" stroke="url(#burg)" stroke-width="70"/>
<rect x="420" y="250" width="220" height="320" rx="10" fill="url(#wood)" transform="rotate(-4 530 410)"/><rect x="455" y="295" width="150" height="200" rx="4" fill="url(#gold)" transform="rotate(-4 530 410)"/>
<path d="M640 300 L800 240 L960 300 L800 360Z" fill="#22201E" stroke="#C7A15B" stroke-width="3"/><rect x="730" y="320" width="140" height="70" rx="10" fill="#22201E"/><path d="M800 300 L900 330 L905 420" fill="none" stroke="#C7A15B" stroke-width="5"/>
<rect x="700" y="500" width="260" height="56" rx="28" fill="#FCF8F2"/><rect x="760" y="500" width="14" height="56" fill="#6B1F2B"/>''', glow='#D8BC84', glow_op=.28)

S['campaign-schools-wide'] = wide(SAND, '#7A4E2D', f'''<ellipse cx="560" cy="572" rx="420" ry="20" fill="url(#shadow)"/>
<rect x="170" y="200" width="230" height="370" rx="10" fill="url(#wood)" transform="rotate(-3 285 385)"/><rect x="205" y="245" width="160" height="230" rx="4" fill="url(#gold)" transform="rotate(-3 285 385)"/>
<path d="M470 120 L520 380 L560 380 L610 120Z" fill="url(#burg)"/><circle cx="540" cy="460" r="100" fill="url(#gold)"/>
<path d="M650 160 L690 400 L720 400 L760 160Z" fill="url(#burg)" opacity=".9"/><circle cx="705" cy="470" r="80" fill="url(#silver)"/>
<rect x="800" y="300" width="170" height="270" rx="8" fill="url(#glass)" stroke="#fff" stroke-width="3"/><rect x="790" y="540" width="190" height="30" rx="4" fill="url(#wood)"/>
<rect x="840" y="380" width="90" height="8" rx="4" fill="#C7A15B"/>''', glow='#ffffff', glow_op=.35, ledge='#C7A15B')

S['campaign-gifts-wide'] = wide(BURG, '#3A2B26', f'''<ellipse cx="560" cy="572" rx="420" ry="20" fill="url(#shadow)"/>
<rect x="180" y="330" width="260" height="240" rx="6" fill="#F7F1E8"/><rect x="295" y="330" width="30" height="240" fill="#6B1F2B"/><rect x="170" y="300" width="280" height="50" rx="6" fill="#FCF8F2"/>
<path d="M310 300 C260 230 230 290 310 300 C390 290 360 230 310 300Z" fill="#8A2E3C"/>
<rect x="490" y="250" width="300" height="320" rx="6" fill="url(#wood)"/><rect x="620" y="250" width="40" height="320" fill="url(#gold)"/>
<path d="M640 250 C580 170 540 240 640 250 C740 240 700 170 640 250Z" fill="#C7A15B"/>
<rect x="840" y="400" width="160" height="170" rx="6" fill="#FCF8F2"/><rect x="905" y="400" width="26" height="170" fill="#C7A15B"/>''')


def scene(w, h, wall, body, glow='#ffffff', glow_op=.4):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">{defs(*wall, glow, glow_op)}'
            f'<rect width="{w}" height="{h}" fill="url(#wall)"/><rect width="{w}" height="{h}" fill="url(#glow)"/>{body}</svg>')

PALM = lambda x, y, s, op: (f'<g transform="translate({x} {y}) scale({s})" fill="#8C6A4A" opacity="{op}">'
  + ''.join(f'<path d="M0 0 C {60+i*14} {-40+i*30} {150+i*20} {-10+i*40} {230+i*18} {30+i*55} C {150+i*10} {20+i*40} {70+i*8} {10+i*30} 0 0Z" transform="rotate({-60+i*24})"/>' for i in range(6))
  + '<rect x="-6" y="0" width="12" height="520" rx="6"/></g>')

# Homepage hero: ivory room, arched niche, walnut console, products on the LEFT, empty wall on the right for RTL copy.
S['hero-teachers'] = scene(1920, 860, ('#F8F3EC', '#EFE5D7'), f"""
{PALM(1500, 40, 1.5, .07)}{PALM(1720, 120, 1.1, .05)}
<path d="M140 860 V330 A330 330 0 0 1 800 330 V860Z" fill="#EADFCF"/>
<path d="M170 860 V335 A300 300 0 0 1 770 335 V860" fill="none" stroke="#C7A15B" stroke-opacity=".55" stroke-width="3"/>
<path d="M0 0 C70 220 30 520 90 860 H0Z" fill="#6B1F2B" opacity=".9"/><path d="M60 0 C150 260 90 560 160 860 H110 C50 560 110 260 20 0Z" fill="#8A2E3C" opacity=".55"/>
<rect x="0" y="690" width="1920" height="170" fill="#E4D6C3"/>
<rect x="60" y="640" width="1000" height="40" rx="6" fill="url(#wood)"/><rect x="90" y="680" width="940" height="180" fill="#5A3622" opacity=".9"/><rect x="60" y="640" width="1000" height="4" fill="#C7A15B" opacity=".7"/>
<ellipse cx="560" cy="648" rx="420" ry="16" fill="url(#shadow)"/>
<g transform="rotate(-3 330 430)"><rect x="200" y="210" width="270" height="420" rx="12" fill="url(#wood)"/><rect x="236" y="256" width="198" height="300" rx="5" fill="url(#gold)"/>
<circle cx="335" cy="320" r="26" fill="none" stroke="#6E5222" stroke-width="4" opacity=".7"/>{lines(335, 370, [130, 90, 115, 80], '#6E5222', .5, 9, 24)}</g>
<path d="M520 120 L575 430 L625 430 L680 120Z" fill="url(#burg)"/><path d="M575 120 L600 430 L625 120Z" fill="#C7A15B" opacity=".75"/>
<circle cx="600" cy="520" r="112" fill="url(#gold)"/><circle cx="600" cy="520" r="86" fill="none" stroke="#8C6A2E" stroke-width="5" opacity=".6"/>
<path d="M600 460 l20 41 45 6 -33 32 8 45 -40 -21 -40 21 8 -45 -33 -32 45 -6z" fill="#8C6A2E" opacity=".55"/>
<rect x="760" y="430" width="230" height="210" rx="6" fill="#FCF8F2"/><rect x="862" y="430" width="26" height="210" fill="#6B1F2B"/><rect x="748" y="400" width="254" height="44" rx="6" fill="#FFFFFF"/>
<path d="M875 400 C820 330 780 390 875 400 C970 390 930 330 875 400Z" fill="#6B1F2B"/>
<rect x="790" y="560" width="70" height="40" rx="3" fill="#F3E9D4" transform="rotate(-6 825 580)"/>
""", glow='#ffffff', glow_op=.5)

# Light banner: three medals hanging on sand wall, products left.
S['banner-medals-wide'] = scene(1920, 760, ('#F3ECE2', '#E8DCCB'), f"""
{PALM(1560, 60, 1.3, .06)}
<rect x="0" y="600" width="1920" height="160" fill="#DCCBB4"/><rect x="0" y="600" width="1920" height="4" fill="#C7A15B" opacity=".5"/>
<rect x="140" y="80" width="880" height="12" rx="6" fill="url(#wood)"/>
<path d="M230 92 L300 400 L340 400 L410 92Z" fill="#F7F1E8"/><path d="M290 92 L320 400 L350 92Z" fill="#C7A15B" opacity=".5"/>
<path d="M480 92 L560 440 L600 440 L680 92Z" fill="url(#burg)"/><path d="M550 92 L580 440 L610 92Z" fill="#C7A15B" opacity=".8"/>
<path d="M750 92 L820 400 L860 400 L930 92Z" fill="#F7F1E8"/><path d="M810 92 L840 400 L870 92Z" fill="#8A2E3C" opacity=".6"/>
<ellipse cx="580" cy="612" rx="420" ry="14" fill="url(#shadow)"/>
<circle cx="320" cy="480" r="98" fill="url(#silver)"/><circle cx="320" cy="480" r="74" fill="none" stroke="#8E9296" stroke-width="5" opacity=".6"/>
<circle cx="580" cy="530" r="122" fill="url(#gold)"/><circle cx="580" cy="530" r="94" fill="none" stroke="#8C6A2E" stroke-width="5" opacity=".6"/>
<path d="M580 466 l22 44 49 7 -36 35 9 49 -44 -23 -44 23 9 -49 -36 -35 49 -7z" fill="#8C6A2E" opacity=".5"/>
<circle cx="840" cy="480" r="98" fill="url(#bronze)"/><circle cx="840" cy="480" r="74" fill="none" stroke="#6E4222" stroke-width="5" opacity=".6"/>
""")

os.makedirs(OUT, exist_ok=True)
for k, v in S.items():
    open(os.path.join(OUT, k + '.svg'), 'w').write(v)
print(len(S), 'placeholders written')

# ---- White-studio variants for product cards (IBRAQ-style: products on white) ----
import re
WHITE = os.path.join(os.path.dirname(__file__), '..', 'public', 'images', 'products-ph')
os.makedirs(WHITE, exist_ok=True)
for f in sorted(os.listdir(OUT)):
    if not f.endswith('.svg') or f.startswith(('hero-', 'banner-', 'school-logo')):
        continue
    src = open(os.path.join(OUT, f)).read()
    vb = re.search(r'viewBox="0 0 (\d+) (\d+)"', src)
    if not vb:
        continue
    W = vb.group(1)
    # wall → white with the faintest warm fall-off
    src = re.sub(r'(<linearGradient id="wall"[^>]*>)(.*?)(</linearGradient>)',
                 r'\1<stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#F6F4F1"/>\3', src, flags=re.S)
    src = re.sub(r'(<radialGradient id="glow"[^>]*>).*?(</radialGradient>)',
                 r'\1<stop offset="0" stop-color="#ffffff" stop-opacity="0"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/>\2', src, flags=re.S)
    # full-width floor / table bands → pale stone
    src = re.sub(r'(<rect x="0" y="\d+" width="' + W + r'" height="\d+" fill=")([^"]+)(")', r'\1#EFECE8\3', src)
    # curtain/drape shapes along the edges → removed for a clean studio look
    src = re.sub(r'<path d="M0 0 C[^"]*" fill="#[0-9A-Fa-f]{6}" opacity="[\d.]+"\s*/?>(</path>)?', '', src)
    src = re.sub(r'<path d="M\d+ 0 C[^"]*H\d+ C[^"]*Z" fill="#[0-9A-Fa-f]{6}" opacity="[\d.]+"\s*/?>(</path>)?', '', src)
    # sand floor curves → pale stone; near-white product bodies get a touch more tone so they read on white
    src = src.replace('fill="#EADFCD"', 'fill="#EFECE8"').replace('fill="#D9C8B0"', 'fill="#EFECE8"')
    src = src.replace('fill="#FCF8F2"', 'fill="#F1EADF"').replace('fill="#F7F1E8"', 'fill="#ECE3D5"').replace('fill="#FFFFFF"/><rect', 'fill="#F4EFE7"/><rect')
    open(os.path.join(WHITE, f), 'w').write(src)
print('white variants written to', WHITE)
