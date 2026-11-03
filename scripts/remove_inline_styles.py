from pathlib import Path

path = Path(r'c:\Users\stuart\Desktop\Academia\App.js')
text = path.read_text(encoding='utf-8')
start = text.index('const styles = StyleSheet.create({')
end = text.rindex('});') + len('});')
path.write_text(text[:start] + text[end:], encoding='utf-8')
print('trimmed inline styles from App.js')
