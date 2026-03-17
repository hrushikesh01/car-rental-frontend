import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

for f in html_files:
    if f in ('index.html', 'login.html'):
        continue
    
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    if '<nav' not in content:
        continue
        
    act_b = ' class="active"' if 'budget' in f.lower() else ''
    act_p = ' class="active"' if 'premium' in f.lower() else ''
    act_l = ' class="active"' if 'luxury' in f.lower() else ''
    
    new_nav = f"""<!-- ================= NAVBAR ================= -->
  <nav class="main-navbar">
    <div class="logo"><a href="index.html">DRIVE</a></div>
    <ul class="nav-links">
      <li><a href="budget.html"{act_b}>Budget</a></li>
      <li><a href="premium.html"{act_p}>Premium</a></li>
      <li><a href="luxury.html"{act_l}>Luxury</a></li>
      <li id="authLink"><a href="login.html">Login</a></li>
    </ul>
  </nav>"""
    
    # Replace nav
    content = re.sub(r'<nav[^>]*>.*?</nav>', new_nav, content, flags=re.DOTALL)
    
    # Add auth.js script if not present
    if 'src="js/auth.js"' not in content:
        content = re.sub(r'</body>', r'<script src="js/auth.js"></script>\n</body>', content, flags=re.IGNORECASE)
        
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)
        
print("Updated all navbars!")
